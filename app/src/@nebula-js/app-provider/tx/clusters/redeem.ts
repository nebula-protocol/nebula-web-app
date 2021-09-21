import { useApp, useGasPrice, useRefetchQueries } from '@libs/app-provider';
import {
  clusterRedeemTx,
  computeClusterGasWanted,
  NebulaContants,
  NebulaContractAddress,
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

  const { wasmClient, txErrorReporter, contractAddress, constants } = useApp<
    NebulaContractAddress,
    NebulaContants
  >();

  const fixedFee = useGasPrice(constants.fixedGas, 'uusd');

  const refetchQueries = useRefetchQueries();

  //const {
  //  constants: { fixedFee, gasAdjustment, clusterFee },
  //  contractAddress,
  //} = useNebulaWebapp();

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
          constants.clusterFee.default,
          assets.length,
          assets.length,
        ),
        gasAdjustment: constants.gasAdjustment,
        wasmClient,
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
      constants.clusterFee.default,
      constants.gasAdjustment,
      contractAddress.incentives,
      fixedFee,
      refetchQueries,
      txErrorReporter,
      wasmClient,
    ],
  );

  return connectedWallet ? stream : null;
}
