import { useFixedFee, useUstBalance, useUstTax } from '@libs/app-provider';
import { useForm } from '@libs/use-form';
import { clusterSwapForm } from '@nebula-js/app-fns';
import { cluster, UST } from '@nebula-js/types';
import { useConnectedWallet } from '@terra-money/use-wallet';
import { useNebulaApp } from '../../../hooks/useNebulaApp';

export interface ClusterSwapFormParams {
  clusterState: cluster.ClusterStateResponse;
}

export function useClusterSwapForm({ clusterState }: ClusterSwapFormParams) {
  const connectedWallet = useConnectedWallet();

  const { queryClient, gasPrice, constants, contractAddress } = useNebulaApp();

  const fixedFee = useFixedFee();

  const { taxRate, maxTax } = useUstTax();

  const uUST = useUstBalance();

  return useForm(
    clusterSwapForm,
    {
      queryClient,
      ustBalance: uUST,
      taxRate,
      maxTaxUUSD: maxTax,
      clusterState,
      terraswapFactoryAddr: contractAddress.terraswap.factory,
      fixedFee,
      clusterFee: constants.nebula.clusterFee,
      gasPrice,
      connected: !!connectedWallet,
    },
    () => {
      return {
        ustAmount: '' as UST,
      };
    },
  );
}
