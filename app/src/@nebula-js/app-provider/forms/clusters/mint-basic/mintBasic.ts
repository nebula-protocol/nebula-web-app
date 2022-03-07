import { useForm } from '@libs/use-form';
import { clusterMintBasicForm } from '@nebula-js/app-fns';
import { useProtocolFee } from '@nebula-js/app-provider';
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

  const protocolFee = useProtocolFee();

  return useForm(
    clusterMintBasicForm,
    {
      queryClient,
      providedAmounts,
      lastSyncedHeight,
      clusterState,
      protocolFee,
      clusterFee: constants.nebula.clusterFee,
      gasPrice,
    },
    () => {
      return {};
    },
  );
}
