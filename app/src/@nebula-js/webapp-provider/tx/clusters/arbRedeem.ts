import { useRefetchQueries, useTerraWebapp } from '@libs/webapp-provider';
import { Gas, HumanAddr, terraswap, Token, u, UST } from '@nebula-js/types';
import { clusterArbRedeemTx } from '@nebula-js/webapp-fns';
import { NEBULA_TX_KEYS } from '@nebula-js/webapp-provider/env';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useCallback } from 'react';
import { useNebulaWebapp } from '../../contexts/webapp';

export interface ClusterArbRedeemTxParams {
  amount: u<UST>;
  txFee: u<UST>;

  onTxSucceed?: () => void;
}

export function useClusterArbRedeemTx(
  clusterAddr: HumanAddr,
  assets: terraswap.Asset<Token>[],
) {
  const connectedWallet = useConnectedWallet();

  const { mantleFetch, mantleEndpoint, txErrorReporter } = useTerraWebapp();

  const refetchQueries = useRefetchQueries();

  const {
    constants: { fixedGas, gasFee, gasAdjustment, clusterFee },
    contractAddress,
  } = useNebulaWebapp();

  const stream = useCallback(
    ({ amount, txFee, onTxSucceed }: ClusterArbRedeemTxParams) => {
      if (!connectedWallet || !connectedWallet.availablePost) {
        throw new Error(`Can't post!`);
      }

      return clusterArbRedeemTx({
        txFee,
        walletAddr: connectedWallet.walletAddress,
        incentivesAddr: contractAddress.incentives,
        clusterAddr,
        fixedGas,
        gasFee: (gasFee + clusterFee.gasLimitPerAsset * assets.length) as Gas,
        gasAdjustment,
        mantleEndpoint,
        mantleFetch,
        txErrorReporter,
        onTxSucceed: () => {
          onTxSucceed?.();
          refetchQueries(NEBULA_TX_KEYS.CLUSTER_ARB_REDEEM);
        },
        network: connectedWallet.network,
        post: connectedWallet.post,
        amount,
      });
    },
    [
      assets.length,
      clusterAddr,
      clusterFee.gasLimitPerAsset,
      connectedWallet,
      contractAddress.incentives,
      fixedGas,
      gasAdjustment,
      gasFee,
      mantleEndpoint,
      mantleFetch,
      refetchQueries,
      txErrorReporter,
    ],
  );

  return connectedWallet ? stream : null;
}
