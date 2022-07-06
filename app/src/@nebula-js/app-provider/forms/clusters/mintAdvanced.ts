import { useFixedFee, useTerraBalancesQuery } from '@libs/app-provider';
import { useForm } from '@libs/use-form';
import { clusterMintAdvancedForm } from '@nebula-js/app-fns';
import { useProtocolFee } from '@nebula-js/app-provider';
import { cluster, CT, terraswap, Token, Luna } from '@nebula-js/types';
import { useMemo } from 'react';
import { useNebulaApp } from '../../hooks/useNebulaApp';

export interface ClusterMintAdvancedFormParams {
  clusterState: cluster.ClusterStateResponse;
  terraswapPool: terraswap.pair.PoolResponse<CT, Luna>;
}

export function useClusterMintAdvancedForm({
  clusterState,
  terraswapPool,
}: ClusterMintAdvancedFormParams) {
  const { queryClient, lastSyncedHeight, gasPrice, constants } = useNebulaApp();

  const assetInfos = useMemo(() => {
    return clusterState.target.map(({ info }) => info);
  }, [clusterState.target]);

  const fixedFee = useFixedFee();

  const { data: balances } = useTerraBalancesQuery(assetInfos);

  const protocolFee = useProtocolFee();

  return useForm(
    clusterMintAdvancedForm,
    {
      queryClient,
      clusterState,
      protocolFee,
      terraswapPool,
      lastSyncedHeight,
      balances,
      fixedFee,
      clusterFee: constants.nebula.clusterFee,
      gasPrice,
    },
    () => {
      return {
        addedAssets: new Set<terraswap.Asset<Token>>(),
        amounts: assetInfos.map(() => '' as Token),
      };
    },
  );
}
