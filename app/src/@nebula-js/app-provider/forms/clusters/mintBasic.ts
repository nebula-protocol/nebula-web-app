import { useFixedFee, useUstBalance, useUstTax } from '@libs/app-provider';
import { useForm } from '@libs/use-form';
import { clusterMintBasicForm } from '@nebula-js/app-fns';
import { cluster, UST } from '@nebula-js/types';
import { useNebulaApp } from '../../hooks/useNebulaApp';

export interface ClusterMintBasicFormParams {
  clusterState: cluster.ClusterStateResponse;
}

export function useClusterMintBasicForm({
  clusterState,
}: ClusterMintBasicFormParams) {
  const { queryClient, gasPrice, constants, contractAddress } = useNebulaApp();

  const fixedFee = useFixedFee();

  const { taxRate, maxTax } = useUstTax();

  const uUST = useUstBalance();

  return useForm(
    clusterMintBasicForm,
    {
      queryClient,
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
