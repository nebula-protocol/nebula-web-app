import { GasPrice, TerraBalances } from '@libs/app-fns';
import { vectorDot } from '@libs/big-math';
import { microfy } from '@libs/formatter';
import { QueryClient } from '@libs/query-client';
import { FormReturn } from '@libs/use-form';
import { computeCTPrices } from '@nebula-js/app-fns';
import { cluster, CT, Rate, terraswap, Token, u, UST } from '@nebula-js/types';
import big, { Big, BigSource } from 'big.js';
import {
  computeClusterTxFee,
  computeUTokenWithoutFee,
} from '@nebula-js/app-fns';
import { clusterMintQuery } from '../../queries/clusters/mint';
import { NebulaClusterFee } from '../../types';

export interface ClusterMintAdvancedFormInput {
  addedAssets: Set<terraswap.Asset<Token>>;
  amounts: Token[];
}

export interface ClusterMintAdvancedFormDependency {
  queryClient: QueryClient;
  balances: TerraBalances | undefined;
  lastSyncedHeight: () => Promise<number>;
  clusterState: cluster.ClusterStateResponse;
  protocolFee: Rate;
  terraswapPool: terraswap.pair.PoolResponse<CT, UST>;
  gasPrice: GasPrice;
  clusterFee: NebulaClusterFee;
  fixedFee: u<UST<BigSource>>;
}

export interface ClusterMintAdvancedFormStates
  extends ClusterMintAdvancedFormInput {
  invalidAmounts: (string | null)[];
  invalidMintQuery: string | null;
  remainAssets: terraswap.Asset<Token>[];
  balances?: TerraBalances;
  txFee: u<UST> | null;
}

export interface ClusterMintAdvancedFormAsyncStates {
  mintedAmount?: u<CT>;
  totalInputValue?: u<UST<Big>>;
  pnl: u<UST> | undefined;
}

export const clusterMintAdvancedForm = (
  dependency: ClusterMintAdvancedFormDependency,
  prevDependency: ClusterMintAdvancedFormDependency | undefined,
) => {
  let invalidAmounts: (string | null)[];
  let invalidMintQuery: string | null;
  let remainAssets: terraswap.Asset<Token>[];
  let asyncStates: Promise<ClusterMintAdvancedFormAsyncStates>;

  return (
    input: ClusterMintAdvancedFormInput,
    prevInput: ClusterMintAdvancedFormInput | undefined,
  ): FormReturn<
    ClusterMintAdvancedFormStates,
    ClusterMintAdvancedFormAsyncStates
  > => {
    // validate inputAmount > balance
    if (
      !invalidAmounts ||
      dependency.clusterState !== prevDependency?.clusterState ||
      dependency.balances !== prevDependency?.balances ||
      input.amounts !== prevInput?.amounts
    ) {
      invalidAmounts = dependency.clusterState.target.map((_, i) => {
        const amount = input.amounts[i];
        const balance = dependency.balances?.balances[i].balance ?? 0;

        return balance && amount.length > 0 && microfy(amount).gt(balance)
          ? 'Not enough assets'
          : null;
      });
    }

    // update remainAssets
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
      dependency.terraswapPool !== prevDependency?.terraswapPool ||
      dependency.clusterFee !== prevDependency?.clusterFee ||
      dependency.gasPrice !== prevDependency?.gasPrice ||
      input.amounts !== prevInput?.amounts
    ) {
      const hasAmounts = input.amounts.some((amount) => amount.length > 0);

      asyncStates = hasAmounts
        ? clusterMintQuery(
            input.amounts.map(
              (amount) =>
                (amount.length > 0
                  ? microfy(amount).toFixed()
                  : '0') as u<Token>,
            ),
            dependency.clusterState,
            dependency.lastSyncedHeight,
            dependency.queryClient,
          )
            .then(({ mint }) => {
              if (big(mint.create_tokens).eq(0)) {
                return {
                  mintedAmount: undefined,
                  pnl: undefined,
                  totalInputValue: undefined,
                  txFee: null,
                };
              }

              const mintedAmountWithoutFee = computeUTokenWithoutFee(
                mint.create_tokens as u<CT>,
                dependency.protocolFee,
              );

              const clusterTxFee = computeClusterTxFee(
                dependency.gasPrice,
                dependency.clusterFee.default,
                dependency.clusterState.target.length,
                dependency.clusterState.target.length,
              );

              const clusterPrice = computeCTPrices(
                dependency.clusterState,
                dependency.terraswapPool,
              ).clusterPrice;

              // totalMintValue = createToken * clusterPrice
              const totalMintValue = big(mintedAmountWithoutFee).mul(
                clusterPrice,
              ) as u<UST<Big>>;

              const totalInputValue = vectorDot(
                input.amounts.map((amount) =>
                  amount.length > 0 ? microfy(amount).toFixed() : '0',
                ),
                dependency.clusterState.prices,
              ) as u<UST<Big>>;

              return {
                mintedAmount: mintedAmountWithoutFee,
                pnl: totalMintValue.minus(totalInputValue).toFixed() as u<UST>,
                totalInputValue,
                txFee: clusterTxFee,
              };
            })
            .catch((err) => {
              invalidMintQuery = err.message;

              return {
                mintedAmount: undefined,
                pnl: undefined,
                totalInputValue: undefined,
                invalidMintQuery,
              };
            })
        : Promise.resolve({
            mintedAmount: undefined,
            pnl: undefined,
            totalInputValue: undefined,
            invalidMintQuery: undefined,
            txFee: null,
          });
    }

    return [
      {
        ...input,
        invalidAmounts,
        invalidMintQuery,
        remainAssets,
        balances: dependency.balances,
        txFee: null,
      },
      asyncStates,
    ];
  };
};
