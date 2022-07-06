import { useFixedFee, useRefetchQueries } from '@libs/app-provider';
import { clusterRedeemTx, computeClusterGasWanted } from '@nebula-js/app-fns';
import {
  CT,
  CW20Addr,
  HumanAddr,
  terraswap,
  Token,
  u,
  Luna,
} from '@nebula-js/types';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useCallback } from 'react';
import { NEBULA_TX_KEYS } from '../../env';
import { useNebulaApp } from '../../hooks/useNebulaApp';

export interface ClusterRedeemTxParams {
  amount: u<CT>;
  txFee: u<Luna>;

  onTxSucceed?: () => void;
}

export function useClusterRedeemTx(
  clusterAddr: HumanAddr,
  clusterTokenAddr: CW20Addr,
  assets: terraswap.Asset<Token>[],
) {
  const connectedWallet = useConnectedWallet();

  const { queryClient, txErrorReporter, contractAddress, constants } =
    useNebulaApp();

  const fixedFee = useFixedFee();

  const refetchQueries = useRefetchQueries();

  const stream = useCallback(
    ({ amount, txFee, onTxSucceed }: ClusterRedeemTxParams) => {
      if (!connectedWallet || !connectedWallet.availablePost) {
        throw new Error(`Can't post!`);
      }

      return clusterRedeemTx({
        txFee,
        walletAddr: connectedWallet.walletAddress,
        incentivesAddr: contractAddress.incentives,
        clusterAddr,
        clusterTokenAddr,
        amount,
        fixedFee,
        gasWanted: computeClusterGasWanted(
          constants.nebula.clusterFee.default,
          assets.length,
          assets.length,
        ),
        gasAdjustment: constants.gasAdjustment,
        queryClient,
        txErrorReporter,
        onTxSucceed: () => {
          onTxSucceed?.();
          refetchQueries(NEBULA_TX_KEYS.CLUSTER_REDEEM);
        },
        network: connectedWallet.network,
        post: connectedWallet.post,
      });
    },
    [
      assets.length,
      clusterAddr,
      clusterTokenAddr,
      connectedWallet,
      constants.nebula.clusterFee.default,
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
