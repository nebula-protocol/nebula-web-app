import { useForm } from '@libs/use-form';
import {
  clusterMintArbBasicForm,
  ClusterMintArbBasicFormInput,
} from '@nebula-js/app-fns';
import { cluster, terraswap, Rate } from '@nebula-js/types';
import { useNebulaApp } from '../../hooks/useNebulaApp';
import { useMintArbTxInfo } from '@nebula-js/app-provider';
import { useTwoSteps } from 'contexts/two-steps';

export interface ClusterMintArbBasicFormParams {
  clusterState: cluster.ClusterStateResponse;
  terraswapPair: terraswap.factory.PairResponse;
}

export function useClusterMintArbBasicForm({
  clusterState,
  terraswapPair,
}: ClusterMintArbBasicFormParams) {
  const { gasPrice, constants } = useNebulaApp();

  const { tokenAmounts } = useTwoSteps();

  const mintArbInfoTx = useMintArbTxInfo(clusterState, terraswapPair);

  return useForm(
    clusterMintArbBasicForm,
    {
      clusterState,
      providedAmounts: tokenAmounts,
      mintArbInfoTx,
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
