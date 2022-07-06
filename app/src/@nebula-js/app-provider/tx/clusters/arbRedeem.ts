import { useFixedFee, useRefetchQueries } from '@libs/app-provider';
import {
  clusterArbRedeemTx,
  computeClusterGasWanted,
} from '@nebula-js/app-fns';
import { HumanAddr, terraswap, Rate, Token, u, Luna } from '@nebula-js/types';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useCallback } from 'react';
import { NEBULA_TX_KEYS } from '../../env';
import { useNebulaApp } from '../../hooks/useNebulaApp';

export interface ClusterArbRedeemTxParams {
  amount: u<Luna>;
  txFee: u<Luna>;
  maxSpread: Rate;

  onTxSucceed?: () => void;
}

export function useClusterArbRedeemTx(
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
    ({ amount, txFee, maxSpread, onTxSucceed }: ClusterArbRedeemTxParams) => {
      if (!connectedWallet || !connectedWallet.availablePost) {
        throw new Error(`Can't post!`);
      }

      return clusterArbRedeemTx({
        txFee,
        walletAddr: connectedWallet.walletAddress,
        incentivesAddr: contractAddress.incentives,
        clusterAddr,
        terraswapPairAddr,
        amount,
        maxSpread,
        fixedFee,
        gasWanted: computeClusterGasWanted(
          constants.nebula.clusterFee.arbRedeem,
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
      });
    },
    [
      assets.length,
      clusterAddr,
      connectedWallet,
      constants.nebula.clusterFee.arbRedeem,
      constants.gasAdjustment,
      contractAddress.incentives,
      terraswapPairAddr,
      fixedFee,
      refetchQueries,
      txErrorReporter,
      queryClient,
    ],
  );

  return connectedWallet ? stream : null;
}
