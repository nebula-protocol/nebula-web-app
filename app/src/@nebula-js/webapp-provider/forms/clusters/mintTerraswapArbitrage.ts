import { cluster, terraswap, Token } from '@nebula-js/types';
import { clusterMintTerraswapArbitrageForm } from '@nebula-js/webapp-fns';
import { useForm } from '@terra-dev/use-form';
import { useTerraWebapp } from '@terra-money/webapp-provider';
import { useMemo } from 'react';
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

  const assetInfos = useMemo(() => {
    return clusterState.target.map(({ info }) => info);
  }, [clusterState.target]);

  const { data: balances } = useTerraBalancesQuery(assetInfos);

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
        addedAssets: new Set<terraswap.Asset<Token>>(),
        amounts: assetInfos.map(() => '' as Token),
      };
    },
  );
}
