import { useFixedFee, useUstBalance, useUstTax } from '@libs/app-provider';
import { useForm } from '@libs/use-form';
import { clusterRedeemTerraswapArbitrageForm } from '@nebula-js/app-fns';
import { useProtocolFee } from '@nebula-js/app-provider/queries/cluster-factory/config';
import { cluster, terraswap, UST, Rate } from '@nebula-js/types';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useNebulaApp } from '../../hooks/useNebulaApp';

export interface ClusterRedeemTerraswapArbitrageFormParams {
  clusterState: cluster.ClusterStateResponse;
  terraswapPair: terraswap.factory.PairResponse;
}

export function useClusterRedeemTerraswapArbitrageForm({
  clusterState,
  terraswapPair,
}: ClusterRedeemTerraswapArbitrageFormParams) {
  const connectedWallet = useConnectedWallet();

  const { queryClient, lastSyncedHeight, gasPrice, constants } = useNebulaApp();

  const fixedFee = useFixedFee();

  const tax = useUstTax();

  const uUST = useUstBalance(connectedWallet?.walletAddress);

  const protocolFee = useProtocolFee();

  return useForm(
    clusterRedeemTerraswapArbitrageForm,
    {
      queryClient,
      lastSyncedHeight,
      ustBalance: uUST,
      terraswapPair,
      protocolFee,
      taxRate: tax.taxRate,
      maxTaxUUSD: tax.maxTax,
      fixedFee,
      clusterFee: constants.nebula.clusterFee,
      gasPrice,
      clusterState,
      connected: !!connectedWallet,
    },
    () => {
      return {
        ustAmount: '' as UST,
        maxSpread: '0.01' as Rate,
      };
    },
  );
}
