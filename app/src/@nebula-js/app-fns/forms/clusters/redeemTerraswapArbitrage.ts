import {
  computeMaxUstBalanceForUstTransfer,
  GasPrice,
  terraswapSimulationQuery,
} from '@libs/app-fns';
import { sum, vectorMultiply } from '@libs/big-math';
import { demicrofy, microfy } from '@libs/formatter';
import { QueryClient } from '@libs/query-client';
import { FormReturn } from '@libs/use-form';
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
  invalidUstAmount: string | null;
  maxUstAmount: u<UST<BigSource>>;
  invalidTxFee: string | null;
}

export interface ClusterRedeemTerraswapArbitrageFormAsyncStates {
  burntTokenAmount?: u<CT>;
  redeemTokenAmounts?: u<Token>[];
  redeemValue?: u<UST>;
  txFee?: u<UST>;
}

export const clusterRedeemTerraswapArbitrageForm = (
  dependency: ClusterRedeemTerraswapArbitrageFormDependency,
  prevDependency: ClusterRedeemTerraswapArbitrageFormDependency | undefined,
) => {
  const maxUstAmount = computeMaxUstBalanceForUstTransfer(
    dependency.ustBalance,
    dependency.taxRate,
    dependency.maxTaxUUSD,
    dependency.fixedFee,
  );

  let invalidUstAmount: string | null;
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
          invalidTxFee: null,
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
      input.ustAmount !== prevInput?.ustAmount
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
        .then(({ simulation: { return_amount } }) => {
          const clusterTxFee = computeClusterTxFee(
            dependency.gasPrice,
            dependency.clusterFee.default,
            dependency.clusterState.target.length,
            dependency.clusterState.target.length,
          );

          //const _tax = min(
          //  microfy(input.ustAmount!).mul(dependency.tax.taxRate),
          //  dependency.tax.maxTaxUUSD,
          //) as u<UST<Big>>;
          //
          //txFee = _tax.plus(dependency.fixedGas).toFixed() as u<UST>;
          txFee = clusterTxFee;

          return clusterRedeemQuery(
            demicrofy(return_amount as u<CT>).toFixed() as CT,
            [], // redeem_asset_amounts = []
            dependency.clusterState,
            dependency.lastSyncedHeight,
            dependency.queryClient,
          );
        })
        .then(({ redeem }) => {
          return {
            burntTokenAmount: redeem.token_cost,
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
        });
    }

    return [
      { ...input, maxUstAmount, invalidUstAmount, invalidTxFee: null },
      asyncStates,
    ];
  };
};
