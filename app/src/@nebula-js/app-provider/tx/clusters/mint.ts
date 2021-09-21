import { useApp, useGasPrice, useRefetchQueries } from '@libs/app-provider';
import {
  clusterMintTx,
  computeClusterGasWanted,
  NebulaContants,
  NebulaContractAddress,
} from '@nebula-js/app-fns';
import { HumanAddr, terraswap, Token, u, UST } from '@nebula-js/types';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import big from 'big.js';
import { useCallback } from 'react';
import { NEBULA_TX_KEYS } from '../../env';

export interface ClusterMintTxParams {
  amounts: u<Token>[];
  txFee: u<UST>;

  onTxSucceed?: () => void;
}

export function useClusterMintTx(
  clusterAddr: HumanAddr,
  assets: terraswap.Asset<Token>[],
) {
  const connectedWallet = useConnectedWallet();

  const { wasmClient, txErrorReporter, constants, contractAddress } = useApp<
    NebulaContractAddress,
    NebulaContants
  >();

  const refetchQueries = useRefetchQueries();

  const fixedFee = useGasPrice(constants.fixedGas, 'uusd');

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
        fixedFee,
        gasWanted: computeClusterGasWanted(
          constants.clusterFee.default,
          assets.length,
          amounts.filter((amount) => big(amount).gt(0)).length,
        ),
        gasAdjustment: constants.gasAdjustment,
        wasmClient,
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
