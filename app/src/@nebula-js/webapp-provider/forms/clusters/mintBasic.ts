import { cluster, UST } from '@nebula-js/types';
import {
  clusterMintBasicForm,
  NebulaTax,
  NebulaTokenBalances,
} from '@nebula-js/webapp-fns';
import { useNebulaWebapp } from '../../contexts/webapp';
import { useForm } from '@terra-dev/use-form';
import { useBank, useTerraWebapp } from '@terra-money/webapp-provider';

export interface ClusterMintBasicFormParams {
  clusterState: cluster.ClusterStateResponse;
}

export function useClusterMintBasicForm({
  clusterState,
}: ClusterMintBasicFormParams) {
  const { mantleFetch, mantleEndpoint } = useTerraWebapp();

  const {
    constants: { fixedGas },
  } = useNebulaWebapp();

  const { tax, tokenBalances } = useBank<NebulaTokenBalances, NebulaTax>();

  return useForm(
    clusterMintBasicForm,
    {
      mantleEndpoint,
      mantleFetch,
      ustBalance: tokenBalances.uUST,
      tax,
      fixedGas,
      clusterState,
    },
    () => {
      return {
        ustAmount: '' as UST,
      };
    },
  );
}
