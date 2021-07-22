import { cluster, terraswap, Token } from '@nebula-js/types';
import { clusterMintAdvancedForm } from '@nebula-js/webapp-fns';
import { useForm } from '@terra-dev/use-form';
import { useTerraWebapp } from '@terra-money/webapp-provider';
import { useTerraBalancesQuery } from '../../queries/terra/balances';

export interface ClusterMintAdvancedFormParams {
  clusterState: cluster.ClusterStateResponse;
}

export function useClusterMintAdvancedForm({
  clusterState,
}: ClusterMintAdvancedFormParams) {
  const { mantleFetch, mantleEndpoint, lastSyncedHeight } = useTerraWebapp();

  const { data: balances } = useTerraBalancesQuery(clusterState.assets);

  return useForm(
    clusterMintAdvancedForm,
    {
      mantleEndpoint,
      mantleFetch,
      clusterState,
      lastSyncedHeight,
      balances,
    },
    () => {
      return {
        addedAssets: new Set<terraswap.AssetInfo>(),
        amounts: clusterState.assets.map(() => '' as Token),
      };
    },
  );
}
