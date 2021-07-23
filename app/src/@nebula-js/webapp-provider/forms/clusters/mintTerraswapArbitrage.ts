import { cluster, terraswap, Token } from '@nebula-js/types';
import { clusterMintTerraswapArbitrageForm } from '@nebula-js/webapp-fns';
import { useForm } from '@terra-dev/use-form';
import { useTerraWebapp } from '@terra-money/webapp-provider';
import { useTerraBalancesQuery } from '../../queries/terra/balances';

export interface ClusterMintTerraswapArbitrageFormParams {
  clusterState: cluster.ClusterStateResponse;
  terraswapPair: terraswap.factory.PairResponse;
}

export function useClusterMintTerraswapArbitrageForm({
  clusterState,
  terraswapPair,
}: ClusterMintTerraswapArbitrageFormParams) {
  const { mantleFetch, mantleEndpoint, lastSyncedHeight } = useTerraWebapp();

  const { data: balances } = useTerraBalancesQuery(clusterState.assets);

  return useForm(
    clusterMintTerraswapArbitrageForm,
    {
      mantleEndpoint,
      mantleFetch,
      clusterState,
      lastSyncedHeight,
      terraswapPair,
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
