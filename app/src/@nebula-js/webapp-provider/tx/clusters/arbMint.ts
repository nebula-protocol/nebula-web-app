import { useRefetchQueries, useTerraWebapp } from '@libs/app-provider';
import { HumanAddr, terraswap, Token, u, UST } from '@nebula-js/types';
import {
  clusterArbMintTx,
  computeClusterGasWanted,
} from '@nebula-js/webapp-fns';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import big from 'big.js';
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
    constants: { fixedFee, gasAdjustment, clusterFee },
    contractAddress,
  } = useNebulaWebapp();

  const stream = useCallback(
    ({ amounts, txFee, onTxSucceed }: ClusterArbMintTxParams) => {
      if (!connectedWallet || !connectedWallet.availablePost) {
        throw new Error(`Can't post!`);
      }

      console.log(
        'arbMint.ts..()',
        amounts,
        clusterFee.arbMint,
        amounts.length,
        amounts.filter((amount) => big(amount).gt(0)).length,
      );

      return clusterArbMintTx({
        txFee,
        walletAddr: connectedWallet.walletAddress,
        incentivesAddr: contractAddress.incentives,
        clusterAddr,
        terraswapPairAddr,
        assets,
        amounts,
        fixedGas: fixedFee,
        gasWanted: computeClusterGasWanted(
          clusterFee.arbMint,
          amounts.length,
          amounts.filter((amount) => big(amount).gt(0)).length,
        ),
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
      clusterFee.arbMint,
      connectedWallet,
      contractAddress.incentives,
      fixedFee,
      gasAdjustment,
      mantleEndpoint,
      mantleFetch,
      refetchQueries,
      terraswapPairAddr,
      txErrorReporter,
    ],
  );

  return connectedWallet ? stream : null;
}
