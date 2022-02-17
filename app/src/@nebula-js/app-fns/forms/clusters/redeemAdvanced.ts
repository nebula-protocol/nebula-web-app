import { GasPrice, TerraBalances } from '@libs/app-fns';
import { sum, vectorMultiply } from '@libs/big-math';
import { microfy } from '@libs/formatter';
import { QueryClient } from '@libs/query-client';
import { FormReturn } from '@libs/use-form';
import {
  cluster,
  CT,
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

export interface ClusterRedeemAdvancedFormInput {
  tokenAmount: CT & NoMicro;
  addedAssets: Set<terraswap.Asset<Token>>;
  amounts: Token[];
}

export interface ClusterRedeemAdvancedFormDependency {
  queryClient: QueryClient;
  balances: TerraBalances | undefined;
  lastSyncedHeight: () => Promise<number>;
  //
  clusterState: cluster.ClusterStateResponse;
  //
  tokenBalance: u<CT>;
  taxRate: Rate;
  maxTaxUUSD: u<UST>;
  fixedFee: u<UST<BigSource>>;
  gasPrice: GasPrice;
  clusterFee: NebulaClusterFee;
}

export interface ClusterRedeemAdvancedFormStates
  extends ClusterRedeemAdvancedFormInput {
  invalidTokenAmount: string | null;
  invalidBurntAmount: string | null;
  remainAssets: terraswap.Asset<Token>[];
  tokenBalance: u<CT>;
  balances: TerraBalances | undefined;
  txFee: u<UST> | null;
}

export interface ClusterRedeemAdvancedFormAsyncStates {
  burntTokenAmount?: u<CT>;
  redeemTokenAmounts?: u<Token>[];
  redeemValue?: u<UST>;
}

export const clusterRedeemAdvancedForm = (
  dependency: ClusterRedeemAdvancedFormDependency,
  prevDependency: ClusterRedeemAdvancedFormDependency | undefined,
) => {
  let invalidTokenAmount: string | null;
  let invalidBurntAmount: string | null;
  let remainAssets: terraswap.Asset<Token>[];
  let asyncStates: Promise<ClusterRedeemAdvancedFormAsyncStates>;

  return (
    input: ClusterRedeemAdvancedFormInput,
    prevInput: ClusterRedeemAdvancedFormInput | undefined,
  ): FormReturn<
    ClusterRedeemAdvancedFormStates,
    ClusterRedeemAdvancedFormAsyncStates
  > => {
    if (
      input.tokenAmount.trim().length === 0 ||
      big(input.tokenAmount).eq(0) ||
      input.addedAssets.size === 0
    ) {
      // reset
      asyncStates = Promise.resolve({});
      invalidBurntAmount = null;

      return [
        {
          ...input,
          remainAssets: dependency.clusterState.target,
          tokenBalance: dependency.tokenBalance,
          balances: dependency.balances,
          invalidTokenAmount: null,
          invalidBurntAmount: null,
          txFee: null,
        },
        Promise.resolve({}),
      ];
    }

    if (
      !invalidTokenAmount ||
      dependency.tokenBalance !== prevDependency?.tokenBalance ||
      input.tokenAmount !== prevInput?.tokenAmount
    ) {
      invalidTokenAmount =
        big(input.tokenAmount).gt(0) &&
        microfy(input.tokenAmount).gt(dependency.tokenBalance)
          ? 'Not enough assets'
          : null;
    }

    if (
      !remainAssets ||
      dependency.clusterState !== prevDependency?.clusterState ||
      input.addedAssets !== prevInput?.addedAssets
    ) {
      remainAssets = dependency.clusterState.target.filter((asset) => {
        return !input.addedAssets.has(asset);
      });
    }

    if (
      (!asyncStates ||
        dependency.queryClient !== prevDependency?.queryClient ||
        dependency.lastSyncedHeight !== prevDependency?.lastSyncedHeight ||
        dependency.clusterState !== prevDependency?.clusterState ||
        dependency.clusterFee !== prevDependency?.clusterFee ||
        dependency.gasPrice !== prevDependency?.gasPrice ||
        input.tokenAmount !== prevInput?.tokenAmount ||
        input.addedAssets !== prevInput?.addedAssets ||
        input.amounts !== prevInput.amounts) &&
      input.amounts.find((amount) => amount.length > 0)
    ) {
      asyncStates = clusterRedeemQuery(
        input.tokenAmount,
        input.amounts,
        dependency.clusterState,
        dependency.lastSyncedHeight,
        dependency.queryClient,
      ).then(({ redeem }) => {
        const clusterTxFee = computeClusterTxFee(
          dependency.gasPrice,
          dependency.clusterFee.default,
          dependency.clusterState.target.length,
          dependency.clusterState.target.length,
        );

        invalidBurntAmount = big(redeem.token_cost).gt(
          microfy(input.tokenAmount),
        )
          ? 'Burnt Token Amount exceed.'
          : big(redeem.token_cost).eq(0)
          ? 'Invalid Mint Amount'
          : null;

        return {
          burntTokenAmount: redeem.token_cost,
          redeemTokenAmounts: redeem.redeem_assets,
          redeemValue: sum(
            ...vectorMultiply(
              redeem.redeem_assets,
              dependency.clusterState.prices,
            ),
          ).toFixed() as u<UST>,
          invalidBurntAmount,
          txFee: clusterTxFee as u<UST>,
        };
      });
    }

    return [
      {
        ...input,
        invalidTokenAmount,
        invalidBurntAmount,
        remainAssets,
        balances: dependency.balances,
        tokenBalance: dependency.tokenBalance,
        txFee: null,
      },
      asyncStates,
    ];
  };
};