import {
  useApp,
  useGasPrice,
  useTax,
  useTerraBalancesQuery,
} from '@libs/app-provider';
import { useForm } from '@libs/use-form';
import {
  clusterMintAdvancedForm,
  NebulaContants,
  NebulaContractAddress,
} from '@nebula-js/app-fns';
import { cluster, terraswap, Token } from '@nebula-js/types';
import { useMemo } from 'react';

export interface ClusterMintAdvancedFormParams {
  clusterState: cluster.ClusterStateResponse;
}

export function useClusterMintAdvancedForm({
  clusterState,
}: ClusterMintAdvancedFormParams) {
  const { wasmClient, lastSyncedHeight, gasPrice, constants } = useApp<
    NebulaContractAddress,
    NebulaContants
  >();

  const assetInfos = useMemo(() => {
    return clusterState.target.map(({ info }) => info);
  }, [clusterState.target]);

  const fixedFee = useGasPrice(constants.fixedGas, 'uusd');

  const { taxRate, maxTax } = useTax('uusd');

  const { data: balances } = useTerraBalancesQuery(assetInfos);

  return useForm(
    clusterMintAdvancedForm,
    {
      wasmClient,
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