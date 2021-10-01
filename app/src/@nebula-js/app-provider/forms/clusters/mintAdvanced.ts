import {
  useFixedFee,
  useTerraBalancesQuery,
  useUstTax,
} from '@libs/app-provider';
import { useForm } from '@libs/use-form';
import { clusterMintAdvancedForm } from '@nebula-js/app-fns';
import { cluster, terraswap, Token } from '@nebula-js/types';
import { useMemo } from 'react';
import { useNebulaApp } from '../../hooks/useNebulaApp';

export interface ClusterMintAdvancedFormParams {
  clusterState: cluster.ClusterStateResponse;
}

export function useClusterMintAdvancedForm({
  clusterState,
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
      lastSyncedHeight,
      balances,
      taxRate,
      maxTaxUUSD: maxTax,
      fixedFee,
      clusterFee: constants.clusterFee,
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
