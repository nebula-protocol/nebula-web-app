import { microfy } from '@nebula-js/notation';
import { cluster, CT, terraswap, Token, u } from '@nebula-js/types';
import { clusterMintQuery } from '@nebula-js/webapp-fns/queries/clusters/mint';
import { MantleFetch } from '@terra-dev/mantle';
import { TerraBalances } from '../../queries/terra/balances';

export interface ClusterMintAdvancedFormInput {
  addedAssets: Set<terraswap.AssetInfo>;
  amounts: Token[];
}

export interface ClusterMintAdvancedFormDependency {
  mantleEndpoint: string;
  mantleFetch: MantleFetch;
  requestInit?: Omit<RequestInit, 'method' | 'body'>;
  balances: TerraBalances | undefined;
  lastSyncedHeight: () => Promise<number>;
  clusterState: cluster.ClusterStateResponse;
}

export interface ClusterMintAdvancedFormStates
  extends ClusterMintAdvancedFormInput {
  invalidAmounts: (string | null)[];
  remainAssets: terraswap.AssetInfo[];
  balances: TerraBalances | undefined;
}

export interface ClusterMintAdvancedFormAsyncStates {
  mintedAmount: u<CT> | undefined;
}

export const clusterMintAdvancedForm = (
  dependency: ClusterMintAdvancedFormDependency,
  prevDependency: ClusterMintAdvancedFormDependency | undefined,
) => {
  let invalidAmounts: (string | null)[];
  let remainAssets: terraswap.AssetInfo[];
  let asyncStates: Promise<ClusterMintAdvancedFormAsyncStates>;

  return (
    input: ClusterMintAdvancedFormInput,
    prevInput: ClusterMintAdvancedFormInput | undefined,
  ): [
    ClusterMintAdvancedFormStates,
    Promise<ClusterMintAdvancedFormAsyncStates>,
  ] => {
    if (
      !invalidAmounts ||
      dependency.clusterState !== prevDependency?.clusterState ||
      dependency.balances !== prevDependency?.balances ||
      input.amounts !== prevInput?.amounts
    ) {
      invalidAmounts = dependency.clusterState.assets.map((asset, i) => {
        const amount = input.amounts[i];
        const balance = dependency.balances?.balances[i].balance ?? 0;

        return balance && amount.length > 0 && microfy(amount).gt(balance)
          ? 'Not enough assets'
          : null;
      });
    }

    if (
      !remainAssets ||
      dependency.clusterState !== prevDependency?.clusterState ||
      input.addedAssets !== prevInput?.addedAssets
    ) {
      remainAssets = dependency.clusterState.assets.filter((asset) => {
        return !input.addedAssets.has(asset);
      });
    }

    if (
      !asyncStates ||
      dependency.mantleEndpoint !== prevDependency?.mantleEndpoint ||
      dependency.lastSyncedHeight !== prevDependency?.lastSyncedHeight ||
      dependency.clusterState !== prevDependency?.clusterState ||
      input.amounts !== prevInput?.amounts
    ) {
      const hasAmounts = input.amounts.some((amount) => amount.length > 0);

      asyncStates = hasAmounts
        ? clusterMintQuery({
            mantleEndpoint: dependency.mantleEndpoint,
            mantleFetch: dependency.mantleFetch,
            requestInit: dependency.requestInit,
            lastSyncedHeight: dependency.lastSyncedHeight,
            wasmQuery: {
              mint: {
                contractAddress: dependency.clusterState.penalty,
                query: {
                  mint: {
                    block_height: -1,
                    cluster_token_supply:
                      dependency.clusterState.outstanding_balance_tokens,
                    inventory: dependency.clusterState.inv,
                    mint_asset_amounts: input.amounts.map(
                      (amount) =>
                        (amount.length > 0
                          ? microfy(amount).toFixed()
                          : '0') as u<Token>,
                    ),
                    asset_prices: dependency.clusterState.prices,
                    target_weights: dependency.clusterState.target,
                  },
                },
              },
            },
          }).then(({ mint }) => {
            return { mintedAmount: mint.mint_tokens as u<CT> };
          })
        : Promise.resolve({ mintedAmount: undefined });
    }

    return [
      { ...input, invalidAmounts, remainAssets, balances: dependency.balances },
      asyncStates,
    ];
  };
};
