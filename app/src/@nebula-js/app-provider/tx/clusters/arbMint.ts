import { useFixedFee, useRefetchQueries } from '@libs/app-provider';
import { clusterArbMintTx, computeClusterGasWanted } from '@nebula-js/app-fns';
import { HumanAddr, terraswap, Token, u, Luna } from '@nebula-js/types';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import big from 'big.js';
import { useCallback } from 'react';
import { NEBULA_TX_KEYS } from '../../env';
import { useNebulaApp } from '../../hooks/useNebulaApp';

export interface ClusterArbMintTxParams {
  amounts: u<Token>[];
  txFee: u<Luna>;
  minUust: u<Luna>;

  onTxSucceed?: () => void;
}

export function useClusterArbMintTx(
  clusterAddr: HumanAddr,
  terraswapPairAddr: HumanAddr,
  assets: terraswap.Asset<Token>[],
) {
  const connectedWallet = useConnectedWallet();

  const { queryClient, txErrorReporter, constants, contractAddress } =
    useNebulaApp();

  const fixedFee = useFixedFee();

  const refetchQueries = useRefetchQueries();

  const stream = useCallback(
    ({ amounts, txFee, minUust, onTxSucceed }: ClusterArbMintTxParams) => {
      if (!connectedWallet || !connectedWallet.availablePost) {
        throw new Error(`Can't post!`);
      }

      console.log(
        'arbMint.ts..()',
        amounts,
        constants.nebula.clusterFee.arbMint,
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
        minUust,
        fixedFee,
        gasWanted: computeClusterGasWanted(
          constants.nebula.clusterFee.arbMint,
          amounts.length,
          amounts.filter((amount) => big(amount).gt(0)).length,
        ),
        gasAdjustment: constants.gasAdjustment,
        queryClient,
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
      constants.nebula.clusterFee.arbMint,
      constants.gasAdjustment,
      contractAddress.incentives,
      fixedFee,
      refetchQueries,
      terraswapPairAddr,
      txErrorReporter,
      queryClient,
    ],
  );

  return connectedWallet ? stream : null;
}
