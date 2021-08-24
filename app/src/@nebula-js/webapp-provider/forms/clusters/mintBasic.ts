import { useForm } from '@libs/use-form';
import { useBank, useTerraWebapp } from '@libs/webapp-provider';
import { cluster, UST } from '@nebula-js/types';
import {
  clusterMintBasicForm,
  NebulaTax,
  NebulaTokenBalances,
} from '@nebula-js/webapp-fns';
import { useNebulaWebapp } from '../../contexts/webapp';

export interface ClusterMintBasicFormParams {
  clusterState: cluster.ClusterStateResponse;
}

export function useClusterMintBasicForm({
  clusterState,
}: ClusterMintBasicFormParams) {
  const { mantleFetch, mantleEndpoint, gasPrice } = useTerraWebapp();

  const { constants, contractAddress } = useNebulaWebapp();

  const { tax, tokenBalances } = useBank<NebulaTokenBalances, NebulaTax>();

  return useForm(
    clusterMintBasicForm,
    {
      mantleEndpoint,
      mantleFetch,
      ustBalance: tokenBalances.uUST,
      tax,
      clusterState,
      terraswapFactoryAddr: contractAddress.terraswap.factory,
      fixedGas: constants.fixedGas,
      clusterFee: constants.clusterFee,
      gasPrice,
    },
    () => {
      return {
        ustAmount: '' as UST,
      };
    },
  );
}
