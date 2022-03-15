import { useFixedFee, useTerraBalancesQuery } from '@libs/app-provider';
import { useForm } from '@libs/use-form';
import {
  clusterMintArbBasicForm,
  ClusterMintArbBasicFormInput,
} from '@nebula-js/app-fns';
import { cluster, terraswap, CT, UST, Rate } from '@nebula-js/types';
import { useMemo } from 'react';
import { useNebulaApp } from '../../hooks/useNebulaApp';
import { useProtocolFee } from '@nebula-js/app-provider';
import { useTwoSteps } from 'contexts/two-steps';

export interface ClusterMintArbBasicFormParams {
  clusterState: cluster.ClusterStateResponse;
  terraswapPool: terraswap.pair.PoolResponse<CT, UST>;
  terraswapPair: terraswap.factory.PairResponse;
}

export function useClusterMintArbBasicForm({
  clusterState,
  terraswapPool,
  terraswapPair,
}: ClusterMintArbBasicFormParams) {
  const { queryClient, lastSyncedHeight, gasPrice, constants } = useNebulaApp();

  const assetInfos = useMemo(() => {
    return clusterState.target.map(({ info }) => info);
  }, [clusterState.target]);

  const fixedFee = useFixedFee();

  const { data: balances } = useTerraBalancesQuery(assetInfos);

  const { tokenAmounts } = useTwoSteps();

  const protocolFee = useProtocolFee();

  return useForm(
    clusterMintArbBasicForm,
    {
      queryClient,
      clusterState,
      terraswapPool,
      lastSyncedHeight,
      terraswapPair,
      balances,
      providedAmounts: tokenAmounts,
      protocolFee,
      fixedFee,
      clusterFee: constants.nebula.clusterFee,
      gasPrice,
    },
    () => {
      return {
        maxSpread: '0.01' as Rate,
      } as ClusterMintArbBasicFormInput;
    },
  );
}
