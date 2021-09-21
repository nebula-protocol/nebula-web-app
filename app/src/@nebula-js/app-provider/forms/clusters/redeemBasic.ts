import {
  useApp,
  useCW20Balance,
  useGasPrice,
  useTax,
} from '@libs/app-provider';
import { useForm } from '@libs/use-form';
import {
  clusterRedeemBasicForm,
  NebulaContants,
  NebulaContractAddress,
} from '@nebula-js/app-fns';
import { cluster, CT } from '@nebula-js/types';
import { useConnectedWallet } from '@terra-money/wallet-provider';

export interface ClusterRedeemBasicFormParams {
  clusterState: cluster.ClusterStateResponse;
}

export function useClusterRedeemBasicForm({
  clusterState,
}: ClusterRedeemBasicFormParams) {
  const connectedWallet = useConnectedWallet();

  const { wasmClient, lastSyncedHeight, gasPrice, constants } = useApp<
    NebulaContractAddress,
    NebulaContants
  >();

  const fixedFee = useGasPrice(constants.fixedGas, 'uusd');

  const { maxTax, taxRate } = useTax('uusd');

  const uCT = useCW20Balance<CT>(
    clusterState.cluster_token,
    connectedWallet?.terraAddress,
  );

  return useForm(
    clusterRedeemBasicForm,
    {
      wasmClient,
      lastSyncedHeight,
      tokenBalance: uCT,
      taxRate,
      maxTaxUUSD: maxTax,
      clusterState,
      fixedFee,
      clusterFee: constants.clusterFee,
      gasPrice,
    },
    () => {
      return {
        tokenAmount: '' as CT,
      };
    },
  );
}
