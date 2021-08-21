import { cluster, terraswap, Token } from '@nebula-js/types';
import {
  clusterMintTerraswapArbitrageForm,
  NebulaTax,
  NebulaTokenBalances,
} from '@nebula-js/webapp-fns';
import { useForm } from '@packages/use-form';
import { useBank, useTerraWebapp } from '@packages/webapp-provider';
import { useMemo } from 'react';
import { useNebulaWebapp } from '../../contexts/webapp';
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

  const { tax } = useBank<NebulaTokenBalances, NebulaTax>();

  const { constants } = useNebulaWebapp();

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
      tax,
      fixedGas: constants.fixedGas,
      clusterFee: constants.clusterFee,
      gasPriceEndpoint: constants.gasPriceEndpoint,
    },
    () => {
      return {
        addedAssets: new Set<terraswap.Asset<Token>>(),
        amounts: assetInfos.map(() => '' as Token),
      };
    },
  );
}
