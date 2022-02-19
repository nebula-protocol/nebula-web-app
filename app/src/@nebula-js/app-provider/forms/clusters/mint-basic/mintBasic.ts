import { useForm } from '@libs/use-form';
import { clusterMintBasicForm } from '@nebula-js/app-fns';
import { cluster } from '@nebula-js/types';
import { useMintBasic } from 'contexts/mint-basic';
import { useNebulaApp } from '../../../hooks/useNebulaApp';

export interface ClusterMintBasicFormParams {
  clusterState: cluster.ClusterStateResponse;
}

export function useClusterMintBasicForm({
  clusterState,
}: ClusterMintBasicFormParams) {
  const { queryClient, gasPrice, constants, lastSyncedHeight } = useNebulaApp();
  const { providedAmounts } = useMintBasic();

  return useForm(
    clusterMintBasicForm,
    {
      queryClient,
      providedAmounts,
      lastSyncedHeight,
      clusterState,
      clusterFee: constants.nebula.clusterFee,
      gasPrice,
    },
    () => {
      return {};
    },
  );
}
