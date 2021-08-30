import { useForm } from '@libs/use-form';
import {
  useBank,
  useTerraBalancesQuery,
  useTerraWebapp,
} from '@libs/webapp-provider';
import { cluster, terraswap, Token } from '@nebula-js/types';
import {
  clusterMintAdvancedForm,
  NebulaTax,
  NebulaTokenBalances,
} from '@nebula-js/webapp-fns';
import { useMemo } from 'react';
import { useNebulaWebapp } from '../../contexts/webapp';

export interface ClusterMintAdvancedFormParams {
  clusterState: cluster.ClusterStateResponse;
}

export function useClusterMintAdvancedForm({
  clusterState,
}: ClusterMintAdvancedFormParams) {
  const { mantleFetch, mantleEndpoint, lastSyncedHeight, gasPrice } =
    useTerraWebapp();

  const assetInfos = useMemo(() => {
    return clusterState.target.map(({ info }) => info);
  }, [clusterState.target]);

  const { tax } = useBank<NebulaTokenBalances, NebulaTax>();

  const { constants } = useNebulaWebapp();

  const { data: balances } = useTerraBalancesQuery(assetInfos);

  return useForm(
    clusterMintAdvancedForm,
    {
      mantleEndpoint,
      mantleFetch,
      clusterState,
      lastSyncedHeight,
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
