import {
  useFixedFee,
  useTerraBalancesQuery,
  useUstTax,
} from '@libs/app-provider';
import { useForm } from '@libs/use-form';
import { clusterMintTerraswapArbitrageForm } from '@nebula-js/app-fns';
import { cluster, terraswap, Token } from '@nebula-js/types';
import { useMemo } from 'react';
import { useNebulaApp } from '../../hooks/useNebulaApp';

export interface ClusterMintTerraswapArbitrageFormParams {
  clusterState: cluster.ClusterStateResponse;
  terraswapPair: terraswap.factory.PairResponse;
}

export function useClusterMintTerraswapArbitrageForm({
  clusterState,
  terraswapPair,
}: ClusterMintTerraswapArbitrageFormParams) {
  const { wasmClient, lastSyncedHeight, gasPrice, constants } = useNebulaApp();

  const assetInfos = useMemo(() => {
    return clusterState.target.map(({ info }) => info);
  }, [clusterState.target]);

  const fixedFee = useFixedFee();

  const tax = useUstTax();

  const { data: balances } = useTerraBalancesQuery(assetInfos);

  return useForm(
    clusterMintTerraswapArbitrageForm,
    {
      wasmClient,
      clusterState,
      lastSyncedHeight,
      terraswapPair,
      balances,
      taxRate: tax.taxRate,
      maxTaxUUSD: tax.maxTax,
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
