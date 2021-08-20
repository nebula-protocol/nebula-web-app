import { HumanAddr, terraswap, Token, u, UST } from '@nebula-js/types';
import { clusterMintTx } from '@nebula-js/webapp-fns';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import {
  useRefetchQueries,
  useTerraWebapp,
} from '@terra-money/webapp-provider';
import { useCallback } from 'react';
import { useNebulaWebapp } from '../../contexts/webapp';
import { NEBULA_TX_KEYS } from '../../env';

export interface ClusterMintTxParams {
  amounts: u<Token>[];
  txFee: u<UST>;

  onTxSucceed?: () => void;
}

export function useClusterMintTx(
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
    ({ amounts, txFee, onTxSucceed }: ClusterMintTxParams) => {
      if (!connectedWallet || !connectedWallet.availablePost) {
        throw new Error(`Can't post!`);
      }

      return clusterMintTx({
        txFee,
        walletAddr: connectedWallet.walletAddress,
        incentivesAddr: contractAddress.incentives,
        clusterAddr,
        assets,
        amounts,
        fixedGas,
        gasFee: gasFee + clusterFee.gasLimitPerAsset * assets.length,
        gasAdjustment,
        mantleEndpoint,
        mantleFetch,
        txErrorReporter,
        onTxSucceed: () => {
          onTxSucceed?.();
          refetchQueries(NEBULA_TX_KEYS.CLUSTER_MINT);
        },
        network: connectedWallet.network,
        post: connectedWallet.post,
      });
    },
    [
      assets,
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
