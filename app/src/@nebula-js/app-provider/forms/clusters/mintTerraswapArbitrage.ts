import {
  useApp,
  useGasPrice,
  useTax,
  useTerraBalancesQuery,
} from '@libs/app-provider';
import { useForm } from '@libs/use-form';
import {
  clusterMintTerraswapArbitrageForm,
  NebulaContants,
  NebulaContractAddress,
} from '@nebula-js/app-fns';
import { cluster, terraswap, Token, UST } from '@nebula-js/types';
import { useMemo } from 'react';

export interface ClusterMintTerraswapArbitrageFormParams {
  clusterState: cluster.ClusterStateResponse;
  terraswapPair: terraswap.factory.PairResponse;
}

export function useClusterMintTerraswapArbitrageForm({
  clusterState,
  terraswapPair,
}: ClusterMintTerraswapArbitrageFormParams) {
  const { wasmClient, lastSyncedHeight, gasPrice, constants } = useApp<
    NebulaContractAddress,
    NebulaContants
  >();

  const assetInfos = useMemo(() => {
    return clusterState.target.map(({ info }) => info);
  }, [clusterState.target]);

  const fixedFee = useGasPrice(constants.fixedGas, 'uusd');

  const tax = useTax<UST>('uusd');

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
