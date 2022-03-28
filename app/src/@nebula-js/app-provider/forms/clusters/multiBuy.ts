import { useUstBalance } from '@libs/app-provider';
import { useForm } from '@libs/use-form';
import { clusterMultiBuyForm } from '@nebula-js/app-fns';
import { cluster, terraswap, UST } from '@nebula-js/types';
import { useConnectedWallet } from '@terra-money/use-wallet';
import { useNebulaApp } from '../../hooks/useNebulaApp';
import { useMintArbTxInfo } from '@nebula-js/app-provider';

export interface ClusterMultiBuyFormParams {
  clusterState: cluster.ClusterStateResponse;
  terraswapPair: terraswap.factory.PairResponse;
  isArbitrage: boolean;
}

export function useMultiBuyForm({
  clusterState,
  terraswapPair,
  isArbitrage,
}: ClusterMultiBuyFormParams) {
  const connectedWallet = useConnectedWallet();

  const { queryClient, gasPrice, constants, contractAddress } = useNebulaApp();

  const uUST = useUstBalance();

  const mintArbInfoTx = useMintArbTxInfo(clusterState, terraswapPair);

  return useForm(
    clusterMultiBuyForm,
    {
      queryClient,
      ustBalance: uUST,
      clusterState,
      isArbitrage,
      terraswapFactoryAddr: contractAddress.terraswap.factory,
      anchorProxyAddr: contractAddress.anchor.proxy,
      oracleAddr: contractAddress.oracle,
      aUSTAddr: contractAddress.cw20.aUST,
      swapGasWantedPerAsset: constants.swapGasWantedPerAsset,
      clusterFee: constants.nebula.clusterFee,
      gasPrice,
      mintArbInfoTx,
      connected: !!connectedWallet,
    },
    () => {
      return {
        ustAmount: '' as UST,
      };
    },
  );
}
