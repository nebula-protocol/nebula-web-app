import { useRefetchQueries, useTerraWebapp } from '@libs/webapp-provider';
import {
  CT,
  CW20Addr,
  HumanAddr,
  terraswap,
  Token,
  u,
  UST,
} from '@nebula-js/types';
import {
  clusterRedeemTx,
  computeClusterGasWanted,
} from '@nebula-js/webapp-fns';
import { NEBULA_TX_KEYS } from '@nebula-js/webapp-provider/env';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useCallback } from 'react';
import { useNebulaWebapp } from '../../contexts/webapp';

export interface ClusterRedeemTxParams {
  amount: u<CT>;
  txFee: u<UST>;

  onTxSucceed?: () => void;
}

export function useClusterRedeemTx(
  clusterAddr: HumanAddr,
  clusterTokenAddr: CW20Addr,
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
        fixedGas: fixedFee,
        gasWanted: computeClusterGasWanted(
          clusterFee.default,
          assets.length,
          assets.length,
        ),
        gasAdjustment,
        mantleEndpoint,
        mantleFetch,
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
      clusterFee.default,
      clusterTokenAddr,
      connectedWallet,
      contractAddress.incentives,
      fixedFee,
      gasAdjustment,
      mantleEndpoint,
      mantleFetch,
      refetchQueries,
      txErrorReporter,
    ],
  );

  return connectedWallet ? stream : null;
}
