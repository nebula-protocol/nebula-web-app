import { GasPrice, TerraBalances } from '@libs/app-fns';
import { vectorDot } from '@libs/big-math';
import { microfy } from '@libs/formatter';
import { QueryClient } from '@libs/query-client';
import { FormReturn } from '@libs/use-form';
import {
  cluster,
  CT,
  NoMicro,
  terraswap,
  Rate,
  Token,
  u,
  UST,
} from '@nebula-js/types';
import big, { Big } from 'big.js';
import {
  computeUTokenWithFee,
  computeClusterTxFee,
  computeCTPrices,
} from '@nebula-js/app-fns';
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
  clusterState: cluster.ClusterStateResponse;
  terraswapPool: terraswap.pair.PoolResponse<CT, UST>;
  protocolFee: Rate;
  tokenBalance: u<CT>;
  gasPrice: GasPrice;
  clusterFee: NebulaClusterFee;
}

export interface ClusterRedeemAdvancedFormStates
  extends ClusterRedeemAdvancedFormInput {
  invalidTokenAmount: string | null;
  invalidBurntAmount: string | null;
  invalidRedeemQuery: string | null;
  remainAssets: terraswap.Asset<Token>[];
  tokenBalance: u<CT>;
  balances: TerraBalances | undefined;
  txFee: u<UST> | null;
}

export interface ClusterRedeemAdvancedFormAsyncStates {
  burntTokenAmount?: u<CT>;
  redeemTokenAmounts?: u<Token>[];
  totalRedeemValue?: u<UST<Big>>;
  pnl?: u<UST>;
}

export const clusterRedeemAdvancedForm = (
  dependency: ClusterRedeemAdvancedFormDependency,
  prevDependency: ClusterRedeemAdvancedFormDependency | undefined,
) => {
  let invalidTokenAmount: string | null;
  let invalidBurntAmount: string | null;
  let invalidRedeemQuery: string | null;

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
      input.amounts.every((amount) => amount.length === 0 || big(amount).eq(0))
    ) {
      return [
        {
          ...input,
          remainAssets: dependency.clusterState.target,
          tokenBalance: dependency.tokenBalance,
          balances: dependency.balances,
          invalidTokenAmount: null,
          invalidBurntAmount: null,
          invalidRedeemQuery: null,
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

    if (input.addedAssets.size === 0) {
      asyncStates = Promise.resolve({});
      invalidBurntAmount = null;
      invalidRedeemQuery = null;
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
      !asyncStates ||
      dependency.queryClient !== prevDependency?.queryClient ||
      dependency.lastSyncedHeight !== prevDependency?.lastSyncedHeight ||
      dependency.clusterState !== prevDependency?.clusterState ||
      dependency.clusterFee !== prevDependency?.clusterFee ||
      dependency.gasPrice !== prevDependency?.gasPrice ||
      dependency.protocolFee !== prevDependency.protocolFee ||
      input.tokenAmount !== prevInput?.tokenAmount ||
      input.addedAssets !== prevInput?.addedAssets ||
      input.amounts !== prevInput.amounts
    ) {
      asyncStates = clusterRedeemQuery(
        '0' as u<CT>, // if there are input's amounts, maxToken will be ignored.
        input.amounts,
        dependency.clusterState,
        dependency.lastSyncedHeight,
        dependency.queryClient,
      )
        .then(({ redeem }) => {
          invalidRedeemQuery = null;

          const clusterTxFee = computeClusterTxFee(
            dependency.gasPrice,
            dependency.clusterFee.default,
            dependency.clusterState.target.length,
            dependency.clusterState.target.length,
          );

          const tokenCostWithFee = computeUTokenWithFee(
            redeem.token_cost,
            dependency.protocolFee,
          );

          invalidBurntAmount = big(tokenCostWithFee).gt(
            microfy(input.tokenAmount),
          )
            ? 'Burnt Token Amount exceed.'
            : big(redeem.token_cost).eq(0)
            ? 'Invalid Mint Amount'
            : null;

          const clusterPrice = computeCTPrices(
            dependency.clusterState,
            dependency.terraswapPool,
          ).clusterPrice;

          // burnCTValue = burnToken * clusterPrice
          const burnCTValue = big(tokenCostWithFee).mul(clusterPrice) as u<
            UST<Big>
          >;

          // total redeem assets value
          const totalRedeemValue = vectorDot(
            redeem.redeem_assets,
            dependency.clusterState.prices,
          ) as u<UST<Big>>;

          return {
            burntTokenAmount: tokenCostWithFee,
            redeemTokenAmounts: redeem.redeem_assets,
            totalRedeemValue,
            pnl: totalRedeemValue.minus(burnCTValue).toFixed() as u<UST>,
            invalidBurntAmount,
            invalidRedeemQuery,
            txFee: clusterTxFee as u<UST>,
          };
        })
        .catch((err) => {
          invalidRedeemQuery = err.message;

          return {
            burntTokenAmount: undefined,
            redeemTokenAmounts: undefined,
            totalRedeemValue: undefined,
            pnl: undefined,
            invalidRedeemQuery: null,
          };
        });
    }

    return [
      {
        ...input,
        invalidTokenAmount,
        invalidBurntAmount,
        invalidRedeemQuery,
        remainAssets,
        balances: dependency.balances,
        tokenBalance: dependency.tokenBalance,
        txFee: null,
      },
      asyncStates,
    ];
  };
};
