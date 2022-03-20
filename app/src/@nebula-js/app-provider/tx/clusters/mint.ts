import { useFixedFee, useRefetchQueries } from '@libs/app-provider';
import { clusterMintTx, computeClusterGasWanted } from '@nebula-js/app-fns';
import { HumanAddr, terraswap, Token, u, UST } from '@nebula-js/types';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import big from 'big.js';
import { useCallback } from 'react';
import { NEBULA_TX_KEYS } from '../../env';
import { useNebulaApp } from '../../hooks/useNebulaApp';

export interface ClusterMintTxParams {
  amounts: u<Token>[];
  txFee: u<UST>;

  onTxSucceed?: () => void;
}

export function useClusterMintTx(
  clusterAddr: HumanAddr,
  assets: terraswap.Asset<Token>[],
  tokenSymbol: string,
) {
  const connectedWallet = useConnectedWallet();

  const { queryClient, txErrorReporter, constants, contractAddress } =
    useNebulaApp();

  const refetchQueries = useRefetchQueries();

  const fixedFee = useFixedFee();

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
        tokenSymbol,
        fixedFee,
        gasWanted: computeClusterGasWanted(
          constants.nebula.clusterFee.default,
          assets.length,
          amounts.filter((amount) => big(amount).gt(0)).length,
        ),
        gasAdjustment: constants.gasAdjustment,
        queryClient,
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
      connectedWallet,
      constants.nebula.clusterFee.default,
      constants.gasAdjustment,
      contractAddress.incentives,
      fixedFee,
      tokenSymbol,
      refetchQueries,
      txErrorReporter,
      queryClient,
    ],
  );

  return connectedWallet ? stream : null;
}
