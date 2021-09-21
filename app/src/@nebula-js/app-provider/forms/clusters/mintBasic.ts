import {
  useApp,
  useGasPrice,
  useTax,
  useTerraNativeBalanceQuery,
} from '@libs/app-provider';
import { useForm } from '@libs/use-form';
import {
  clusterMintBasicForm,
  NebulaContants,
  NebulaContractAddress,
} from '@nebula-js/app-fns';
import { cluster, UST } from '@nebula-js/types';

export interface ClusterMintBasicFormParams {
  clusterState: cluster.ClusterStateResponse;
}

export function useClusterMintBasicForm({
  clusterState,
}: ClusterMintBasicFormParams) {
  const { wasmClient, gasPrice, constants, contractAddress } = useApp<
    NebulaContractAddress,
    NebulaContants
  >();

  const fixedFee = useGasPrice(constants.fixedGas, 'uusd');

  const { taxRate, maxTax } = useTax('uusd');

  const uUST = useTerraNativeBalanceQuery<UST>('uusd');

  return useForm(
    clusterMintBasicForm,
    {
      wasmClient,
      ustBalance: uUST,
      taxRate,
      maxTaxUUSD: maxTax,
      clusterState,
      terraswapFactoryAddr: contractAddress.terraswap.factory,
      fixedFee,
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
