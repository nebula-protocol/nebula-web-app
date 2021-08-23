import { cluster, terraswap, UST } from '@nebula-js/types';
import {
  clusterRedeemTerraswapArbitrageForm,
  NebulaTax,
  NebulaTokenBalances,
} from '@nebula-js/webapp-fns';
import { useForm } from '@libs/use-form';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useBank, useTerraWebapp } from '@libs/webapp-provider';
import { useNebulaWebapp } from '../../contexts/webapp';

export interface ClusterRedeemTerraswapArbitrageFormParams {
  clusterState: cluster.ClusterStateResponse;
  terraswapPair: terraswap.factory.PairResponse;
}

export function useClusterRedeemTerraswapArbitrageForm({
  clusterState,
  terraswapPair,
}: ClusterRedeemTerraswapArbitrageFormParams) {
  const connectedWallet = useConnectedWallet();

  const { mantleFetch, mantleEndpoint, lastSyncedHeight } = useTerraWebapp();

  const { constants } = useNebulaWebapp();

  const { tax, tokenBalances } = useBank<NebulaTokenBalances, NebulaTax>();

  return useForm(
    clusterRedeemTerraswapArbitrageForm,
    {
      mantleEndpoint,
      mantleFetch,
      lastSyncedHeight,
      ustBalance: tokenBalances.uUST,
      terraswapPair,
      tax,
      fixedGas: constants.fixedGas,
      clusterFee: constants.clusterFee,
      gasPriceEndpoint: constants.gasPriceEndpoint,
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
