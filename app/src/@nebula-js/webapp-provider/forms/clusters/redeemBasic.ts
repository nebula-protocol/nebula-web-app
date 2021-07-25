import { cluster, CT, u } from '@nebula-js/types';
import {
  clusterRedeemBasicForm,
  NebulaTax,
  NebulaTokenBalances,
} from '@nebula-js/webapp-fns';
import { useForm } from '@terra-dev/use-form';
import {
  useBank,
  useCW20TokenBalance,
  useTerraWebapp,
} from '@terra-money/webapp-provider';
import { useNebulaWebapp } from '../../contexts/webapp';

export interface ClusterRedeemBasicFormParams {
  clusterState: cluster.ClusterStateResponse;
}

export function useClusterRedeemBasicForm({
  clusterState,
}: ClusterRedeemBasicFormParams) {
  const { mantleFetch, mantleEndpoint, lastSyncedHeight } = useTerraWebapp();

  const {
    constants: { fixedGas },
  } = useNebulaWebapp();

  const { tax } = useBank<NebulaTokenBalances, NebulaTax>();

  const tokenBalance = useCW20TokenBalance<u<CT>>(clusterState.cluster_token);

  return useForm(
    clusterRedeemBasicForm,
    {
      mantleEndpoint,
      mantleFetch,
      lastSyncedHeight,
      tokenBalance,
      tax,
      fixedGas,
      clusterState,
    },
    () => {
      return {
        tokenAmount: '' as CT,
      };
    },
  );
}
