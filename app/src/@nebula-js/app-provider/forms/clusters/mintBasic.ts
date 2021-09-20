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
  const { mantleFetch, mantleEndpoint, gasPrice, constants, contractAddress } =
    useApp<NebulaContractAddress, NebulaContants>();

  const fixedFee = useGasPrice(constants.fixedGas, 'uusd');

  const { taxRate, maxTax } = useTax('uusd');

  const uUST = useTerraNativeBalanceQuery<UST>('uusd');

  //const { tax, tokenBalances } = useBank<NebulaTokenBalances, NebulaTax>();

  return useForm(
    clusterMintBasicForm,
    {
      mantleEndpoint,
      mantleFetch,
      ustBalance: uUST,
      taxRate,
      maxTaxUUSD: maxTax,
      clusterState,
      terraswapFactoryAddr: contractAddress.terraswap.factory,
      fixedGas: fixedFee,
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
