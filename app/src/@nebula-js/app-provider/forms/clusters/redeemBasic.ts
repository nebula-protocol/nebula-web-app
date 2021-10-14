import { useCW20Balance, useFixedFee, useUstTax } from '@libs/app-provider';
import { useForm } from '@libs/use-form';
import { clusterRedeemBasicForm } from '@nebula-js/app-fns';
import { cluster, CT } from '@nebula-js/types';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useNebulaApp } from '../../hooks/useNebulaApp';

export interface ClusterRedeemBasicFormParams {
  clusterState: cluster.ClusterStateResponse;
}

export function useClusterRedeemBasicForm({
  clusterState,
}: ClusterRedeemBasicFormParams) {
  const connectedWallet = useConnectedWallet();

  const { queryClient, lastSyncedHeight, gasPrice, constants } = useNebulaApp();

  const fixedFee = useFixedFee();

  const { maxTax, taxRate } = useUstTax();

  const uCT = useCW20Balance<CT>(
    clusterState.cluster_token,
    connectedWallet?.terraAddress,
  );

  return useForm(
    clusterRedeemBasicForm,
    {
      queryClient,
      lastSyncedHeight,
      tokenBalance: uCT,
      taxRate,
      maxTaxUUSD: maxTax,
      clusterState,
      fixedFee,
      clusterFee: constants.nebula.clusterFee,
      gasPrice,
    },
    () => {
      return {
        tokenAmount: '' as CT,
      };
    },
  );
}
