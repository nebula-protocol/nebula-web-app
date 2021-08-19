import { cluster, UST } from '@nebula-js/types';
import {
  clusterMintBasicForm,
  NebulaTax,
  NebulaTokenBalances,
} from '@nebula-js/webapp-fns';
import { useForm } from '@terra-dev/use-form';
import { useBank, useTerraWebapp } from '@terra-money/webapp-provider';
import { useNebulaWebapp } from '../../contexts/webapp';

export interface ClusterMintBasicFormParams {
  clusterState: cluster.ClusterStateResponse;
}

export function useClusterMintBasicForm({
  clusterState,
}: ClusterMintBasicFormParams) {
  const { mantleFetch, mantleEndpoint } = useTerraWebapp();

  const {
    constants: { fixedGas },
    contractAddress,
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
      clusterAddr: clusterState.cluster_contract_address,
      terraswapFactoryAddr: contractAddress.terraswap.factory,
    },
    () => {
      return {
        ustAmount: '' as UST,
      };
    },
  );
}
