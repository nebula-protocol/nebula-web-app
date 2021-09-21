import { useApp, useGasPrice, useRefetchQueries } from '@libs/app-provider';
import {
  govUnstakeTx,
  NebulaContants,
  NebulaContractAddress,
} from '@nebula-js/app-fns';
import { NEB, u, UST } from '@nebula-js/types';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useCallback } from 'react';
import { NEBULA_TX_KEYS } from '../../env';

export interface GovUnstakeTxParams {
  nebAmount: u<NEB>;
  txFee: u<UST>;

  onTxSucceed?: () => void;
}

export function useGovUnstakeTx() {
  const connectedWallet = useConnectedWallet();

  const { wasmClient, txErrorReporter, contractAddress, constants } = useApp<
    NebulaContractAddress,
    NebulaContants
  >();

  const fixedFee = useGasPrice(constants.fixedGas, 'uusd');

  const refetchQueries = useRefetchQueries();

  const stream = useCallback(
    ({ nebAmount, txFee, onTxSucceed }: GovUnstakeTxParams) => {
      if (!connectedWallet || !connectedWallet.availablePost) {
        throw new Error(`Can't post!`);
      }

      return govUnstakeTx({
        txFee,
        walletAddr: connectedWallet.walletAddress,
        nebAmount,
        govAddr: contractAddress.gov,
        fixedFee,
        gasWanted: constants.gasWanted,
        gasAdjustment: constants.gasAdjustment,
        wasmClient,
        txErrorReporter,
        onTxSucceed: () => {
          onTxSucceed?.();
          refetchQueries(NEBULA_TX_KEYS.GOV_UNSTAKE);
        },
        network: connectedWallet.network,
        post: connectedWallet.post,
      });
    },
    [
      connectedWallet,
      constants.gasAdjustment,
      constants.gasWanted,
      contractAddress.gov,
      fixedFee,
      refetchQueries,
      txErrorReporter,
      wasmClient,
    ],
  );

  return connectedWallet ? stream : null;
}
