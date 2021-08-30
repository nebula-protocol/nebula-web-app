import { useForm } from '@libs/use-form';
import {
  useBank,
  useTerraBalancesQuery,
  useTerraWebapp,
} from '@libs/webapp-provider';
import { cluster, terraswap, Token } from '@nebula-js/types';
import {
  clusterMintTerraswapArbitrageForm,
  NebulaTax,
  NebulaTokenBalances,
} from '@nebula-js/webapp-fns';
import { useMemo } from 'react';
import { useNebulaWebapp } from '../../contexts/webapp';

export interface ClusterMintTerraswapArbitrageFormParams {
  clusterState: cluster.ClusterStateResponse;
  terraswapPair: terraswap.factory.PairResponse;
}

export function useClusterMintTerraswapArbitrageForm({
  clusterState,
  terraswapPair,
}: ClusterMintTerraswapArbitrageFormParams) {
  const { mantleFetch, mantleEndpoint, lastSyncedHeight, gasPrice } =
    useTerraWebapp();

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
