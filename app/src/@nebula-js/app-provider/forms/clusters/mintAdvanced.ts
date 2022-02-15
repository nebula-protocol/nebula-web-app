import {
  useFixedFee,
  useTerraBalancesQuery,
  useUstTax,
} from '@libs/app-provider';
import { useForm } from '@libs/use-form';
import { clusterMintAdvancedForm } from '@nebula-js/app-fns';
import { cluster, CT, terraswap, Token, UST } from '@nebula-js/types';
import { useMemo } from 'react';
import { useNebulaApp } from '../../hooks/useNebulaApp';

export interface ClusterMintAdvancedFormParams {
  clusterState: cluster.ClusterStateResponse;
  terraswapPool: terraswap.pair.PoolResponse<CT, UST>;
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

  const { taxRate, maxTax } = useUstTax();

  const { data: balances } = useTerraBalancesQuery(assetInfos);

  return useForm(
    clusterMintAdvancedForm,
    {
      queryClient,
      clusterState,
      terraswapPool,
      lastSyncedHeight,
      balances,
      taxRate,
      maxTaxUUSD: maxTax,
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
