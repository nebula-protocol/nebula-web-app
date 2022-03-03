import {
  computeMaxUstBalanceForUstTransfer,
  GasPrice,
  terraswapSimulationQuery,
} from '@libs/app-fns';
import { sum, vectorMultiply } from '@libs/big-math';
import { microfy } from '@libs/formatter';
import { QueryClient } from '@libs/query-client';
import { FormReturn } from '@libs/use-form';
import { computeMinReceivedToken } from '@nebula-js/app-fns';
import {
  cluster,
  CT,
  NativeDenom,
  NoMicro,
  Rate,
  terraswap,
  Token,
  u,
  UST,
} from '@nebula-js/types';
import big, { BigSource } from 'big.js';
import { computeClusterTxFee } from '../../logics/clusters/computeClusterTxFee';
import { clusterRedeemQuery } from '../../queries/clusters/redeem';
import { NebulaClusterFee } from '../../types';

export interface ClusterRedeemTerraswapArbitrageFormInput {
  ustAmount: UST & NoMicro;
  maxSpread: Rate;
}

export interface ClusterRedeemTerraswapArbitrageFormDependency {
  queryClient: QueryClient;
  lastSyncedHeight: () => Promise<number>;
  //
  clusterState: cluster.ClusterStateResponse;
  terraswapPair: terraswap.factory.PairResponse;
  //
  ustBalance: u<UST>;
  taxRate: Rate;
  maxTaxUUSD: u<UST>;
  fixedFee: u<UST<BigSource>>;
  gasPrice: GasPrice;
  clusterFee: NebulaClusterFee;
  //
  connected: boolean;
}

export interface ClusterRedeemTerraswapArbitrageFormStates
  extends ClusterRedeemTerraswapArbitrageFormInput {
  maxUstAmount: u<UST<BigSource>>;
  invalidUstAmount: string | null;
  invalidTxFee: string | null;
  invalidRedeemQuery: string | null;
  txFee: u<UST> | null;
}

export interface ClusterRedeemTerraswapArbitrageFormAsyncStates {
  minBurntTokenAmount?: u<CT>;
  redeemTokenAmounts?: u<Token>[];
  redeemValue?: u<UST>;
}

export const clusterRedeemTerraswapArbitrageForm = (
  dependency: ClusterRedeemTerraswapArbitrageFormDependency,
  prevDependency: ClusterRedeemTerraswapArbitrageFormDependency | undefined,
) => {
  const clusterTxFee = computeClusterTxFee(
    dependency.gasPrice,
    dependency.clusterFee.default,
    dependency.clusterState.target.length,
    dependency.clusterState.target.length,
  );

  const maxUstAmount = computeMaxUstBalanceForUstTransfer(
    dependency.ustBalance,
    dependency.taxRate,
    dependency.maxTaxUUSD,
    clusterTxFee,
  );

  let invalidUstAmount: string | null;
  let invalidRedeemQuery: string | null;
  let asyncStates: Promise<ClusterRedeemTerraswapArbitrageFormAsyncStates>;

  return (
    input: ClusterRedeemTerraswapArbitrageFormInput,
    prevInput: ClusterRedeemTerraswapArbitrageFormInput | undefined,
  ): FormReturn<
    ClusterRedeemTerraswapArbitrageFormStates,
    ClusterRedeemTerraswapArbitrageFormAsyncStates
  > => {
    if (input.ustAmount.trim().length === 0 || big(input.ustAmount).eq(0)) {
      return [
        {
          ...input,
          maxUstAmount,
          invalidUstAmount: null,
          invalidRedeemQuery: null,
          invalidTxFee: null,
          txFee: null,
        },
        Promise.resolve({}),
      ];
    }

    if (
      !invalidUstAmount ||
      dependency.ustBalance !== prevDependency?.ustBalance ||
      input.ustAmount !== prevInput?.ustAmount
    ) {
      invalidUstAmount =
        big(input.ustAmount).gt(0) && microfy(input.ustAmount).gt(maxUstAmount)
          ? 'Not enough assets'
          : null;
    }

    if (
      !asyncStates ||
      dependency.connected !== prevDependency?.connected ||
      dependency.queryClient !== prevDependency?.queryClient ||
      dependency.lastSyncedHeight !== prevDependency?.lastSyncedHeight ||
      dependency.clusterState !== prevDependency?.clusterState ||
      dependency.gasPrice !== prevDependency?.gasPrice ||
      input.ustAmount !== prevInput?.ustAmount ||
      input.maxSpread !== prevInput?.maxSpread
    ) {
      let txFee: u<UST>;

      asyncStates = terraswapSimulationQuery(
        dependency.terraswapPair.contract_addr,
        {
          amount: microfy(input.ustAmount).toFixed() as u<UST>,
          info: {
            native_token: {
              denom: 'uusd' as NativeDenom,
            },
          },
        },
        dependency.queryClient,
      )
        .then(async ({ simulation: { return_amount } }) => {
          txFee = clusterTxFee;

          const minReceivedCT = computeMinReceivedToken(
            input.ustAmount,
            return_amount,
            input.maxSpread,
          );

          const { redeem } = await clusterRedeemQuery(
            minReceivedCT,
            [],
            dependency.clusterState,
            dependency.lastSyncedHeight,
            dependency.queryClient,
          );

          return {
            minBurntTokenAmount: redeem.token_cost,
            redeemTokenAmounts: redeem.redeem_assets,
            redeemValue: sum(
              ...vectorMultiply(
                redeem.redeem_assets,
                dependency.clusterState.prices,
              ),
            ).toFixed() as u<UST>,
            txFee,
            invalidTxFee:
              dependency.connected && big(txFee).gt(dependency.ustBalance)
                ? 'Not enough transaction fees'
                : null,
          };
        })
        .catch((err) => {
          invalidRedeemQuery = err.message;

          return {
            minBurntTokenAmount: undefined,
            redeemTokenAmounts: undefined,
            redeemValue: undefined,
            invalidRedeemQuery,
          };
        });
    }

    return [
      {
        ...input,
        maxUstAmount,
        invalidUstAmount,
        invalidRedeemQuery,
        invalidTxFee: null,
        txFee: null,
      },
      asyncStates,
    ];
  };
};
