import {
  useApp,
  useGasPrice,
  useTax,
  useTerraNativeBalanceQuery,
} from '@libs/app-provider';
import { useForm } from '@libs/use-form';
import {
  clusterRedeemTerraswapArbitrageForm,
  NebulaContants,
  NebulaContractAddress,
} from '@nebula-js/app-fns';
import { cluster, terraswap, UST } from '@nebula-js/types';
import { useConnectedWallet } from '@terra-money/wallet-provider';

export interface ClusterRedeemTerraswapArbitrageFormParams {
  clusterState: cluster.ClusterStateResponse;
  terraswapPair: terraswap.factory.PairResponse;
}

export function useClusterRedeemTerraswapArbitrageForm({
  clusterState,
  terraswapPair,
}: ClusterRedeemTerraswapArbitrageFormParams) {
  const connectedWallet = useConnectedWallet();

  const { wasmClient, lastSyncedHeight, gasPrice, constants } = useApp<
    NebulaContractAddress,
    NebulaContants
  >();

  const fixedFee = useGasPrice(constants.fixedGas, 'uusd');

  const tax = useTax<UST>('uusd');

  const uUST = useTerraNativeBalanceQuery<UST>('uusd');

  return useForm(
    clusterRedeemTerraswapArbitrageForm,
    {
      wasmClient,
      lastSyncedHeight,
      ustBalance: uUST,
      terraswapPair,
      taxRate: tax.taxRate,
      maxTaxUUSD: tax.maxTax,
      fixedFee,
      clusterFee: constants.clusterFee,
      gasPrice,
      clusterState,
      connected: !!connectedWallet,
    },
    () => {
      return {
        ustAmount: '' as UST,
      };
    },
  );
}
