import { microfy } from '@nebula-js/notation';
import { cluster, terraswap, Token, u } from '@nebula-js/types';
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
  mintedAmount: u<Token>;
}

export const clusterMintAdvancedForm = (
  dependency: ClusterMintAdvancedFormDependency,
  prevDependency: ClusterMintAdvancedFormDependency | undefined,
) => {
  let invalidAmounts: (string | null)[];
  let remainAssets: terraswap.AssetInfo[];
  //let mintPromise: Promise<ClusterMintAdvancedFormAsyncStates>;

  return (
    input: ClusterMintAdvancedFormInput,
    prevInput: ClusterMintAdvancedFormInput | undefined,
  ): [
    ClusterMintAdvancedFormStates,
    Promise<ClusterMintAdvancedFormAsyncStates> | undefined,
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

    return [
      { ...input, invalidAmounts, remainAssets, balances: dependency.balances },
      undefined,
    ];
  };
};
