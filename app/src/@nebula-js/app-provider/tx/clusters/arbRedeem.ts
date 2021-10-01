import { useFixedFee, useRefetchQueries } from '@libs/app-provider';
import {
  clusterArbRedeemTx,
  computeClusterGasWanted,
} from '@nebula-js/app-fns';
import { HumanAddr, terraswap, Token, u, UST } from '@nebula-js/types';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useCallback } from 'react';
import { NEBULA_TX_KEYS } from '../../env';
import { useNebulaApp } from '../../hooks/useNebulaApp';

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

  const { queryClient, txErrorReporter, constants, contractAddress } =
    useNebulaApp();

  const fixedFee = useFixedFee();

  const refetchQueries = useRefetchQueries();

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
        fixedFee,
        gasWanted: computeClusterGasWanted(
          constants.clusterFee.default,
          assets.length,
          assets.length,
        ),
        gasAdjustment: constants.gasAdjustment,
        queryClient,
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
      connectedWallet,
      constants.clusterFee.default,
      constants.gasAdjustment,
      contractAddress.incentives,
      fixedFee,
      refetchQueries,
      txErrorReporter,
      queryClient,
    ],
  );

  return connectedWallet ? stream : null;
}
