import { useFixedFee, useRefetchQueries } from '@libs/app-provider';
import {
  clusterRedeemAdvancedTx,
  computeClusterGasWanted,
} from '@nebula-js/app-fns';
import {
  CT,
  CW20Addr,
  HumanAddr,
  terraswap,
  Token,
  u,
  UST,
} from '@nebula-js/types';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useCallback } from 'react';
import { NEBULA_TX_KEYS } from '../../env';
import { useNebulaApp } from '../../hooks/useNebulaApp';

export interface ClusterRedeemAdvancedTxParams {
  tokenAmount: u<CT>;
  assetAmounts: u<Token>[];
  txFee: u<UST>;

  onTxSucceed?: () => void;
}

export function useClusterRedeemAdvancedTx(
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
    ({
      tokenAmount,
      assetAmounts,
      txFee,
      onTxSucceed,
    }: ClusterRedeemAdvancedTxParams) => {
      if (!connectedWallet || !connectedWallet.availablePost) {
        throw new Error(`Can't post!`);
      }

      return clusterRedeemAdvancedTx({
        txFee,
        walletAddr: connectedWallet.walletAddress,
        incentivesAddr: contractAddress.incentives,
        clusterAddr,
        clusterTokenAddr,
        tokenAmount,
        assets,
        assetAmounts,
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
      assets,
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
