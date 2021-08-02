import { HumanAddr, terraswap, Token, u, UST } from '@nebula-js/types';
import { clusterArbMintTx } from '@nebula-js/webapp-fns';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import {
  useRefetchQueries,
  useTerraWebapp,
} from '@terra-money/webapp-provider';
import { useCallback } from 'react';
import { useNebulaWebapp } from '../../contexts/webapp';
import { NEBULA_TX_KEYS } from '../../env';

export interface ClusterArbMintTxParams {
  amounts: u<Token>[];
  txFee: u<UST>;

  onTxSucceed?: () => void;
}

export function useClusterArbMintTx(
  clusterAddr: HumanAddr,
  terraswapPairAddr: HumanAddr,
  assets: terraswap.Asset<Token>[],
) {
  const connectedWallet = useConnectedWallet();

  const { mantleFetch, mantleEndpoint, txErrorReporter } = useTerraWebapp();

  const refetchQueries = useRefetchQueries();

  const {
    constants: { fixedGas, gasFee, gasAdjustment },
    contractAddress,
  } = useNebulaWebapp();

  const stream = useCallback(
    ({ amounts, txFee, onTxSucceed }: ClusterArbMintTxParams) => {
      if (!connectedWallet || !connectedWallet.availablePost) {
        throw new Error(`Can't post!`);
      }

      return clusterArbMintTx({
        txFee,
        walletAddr: connectedWallet.walletAddress,
        incentivesAddr: contractAddress.incentives,
        clusterAddr,
        terraswapPairAddr,
        assets,
        amounts,
        fixedGas,
        gasFee,
        gasAdjustment,
        mantleEndpoint,
        mantleFetch,
        txErrorReporter,
        onTxSucceed: () => {
          onTxSucceed?.();
          refetchQueries(NEBULA_TX_KEYS.CLUSTER_ARB_MINT);
        },
        network: connectedWallet.network,
        post: connectedWallet.post,
      });
    },
    [
      assets,
      clusterAddr,
      connectedWallet,
      contractAddress.incentives,
      fixedGas,
      gasAdjustment,
      gasFee,
      mantleEndpoint,
      mantleFetch,
      refetchQueries,
      terraswapPairAddr,
      txErrorReporter,
    ],
  );

  return connectedWallet ? stream : null;
}
