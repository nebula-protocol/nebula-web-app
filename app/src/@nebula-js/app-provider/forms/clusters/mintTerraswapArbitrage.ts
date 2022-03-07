import { useFixedFee, useTerraBalancesQuery } from '@libs/app-provider';
import { useForm } from '@libs/use-form';
import {
  clusterMintTerraswapArbitrageForm,
  ClusterMintTerraswapArbitrageFormInput,
} from '@nebula-js/app-fns';
import { cluster, terraswap, CT, Token, UST, Rate } from '@nebula-js/types';
import { useMemo } from 'react';
import { useNebulaApp } from '../../hooks/useNebulaApp';
import { useProtocolFee } from '@nebula-js/app-provider';

export interface ClusterMintTerraswapArbitrageFormParams {
  clusterState: cluster.ClusterStateResponse;
  terraswapPool: terraswap.pair.PoolResponse<CT, UST>;
  terraswapPair: terraswap.factory.PairResponse;
}

export function useClusterMintTerraswapArbitrageForm({
  clusterState,
  terraswapPool,
  terraswapPair,
}: ClusterMintTerraswapArbitrageFormParams) {
  const { queryClient, lastSyncedHeight, gasPrice, constants } = useNebulaApp();

  const assetInfos = useMemo(() => {
    return clusterState.target.map(({ info }) => info);
  }, [clusterState.target]);

  const fixedFee = useFixedFee();

  const { data: balances } = useTerraBalancesQuery(assetInfos);

  const protocolFee = useProtocolFee();

  return useForm(
    clusterMintTerraswapArbitrageForm,
    {
      queryClient,
      clusterState,
      terraswapPool,
      lastSyncedHeight,
      terraswapPair,
      balances,
      protocolFee,
      fixedFee,
      clusterFee: constants.nebula.clusterFee,
      gasPrice,
    },
    () => {
      return {
        addedAssets: new Set<terraswap.Asset<Token>>(),
        amounts: assetInfos.map(() => '' as Token),
        maxSpread: '0.01' as Rate,
      } as ClusterMintTerraswapArbitrageFormInput;
    },
  );
}
