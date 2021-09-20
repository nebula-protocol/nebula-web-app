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

  const {
    mantleFetch,
    mantleEndpoint,
    txErrorReporter,
    contractAddress,
    constants,
  } = useApp<NebulaContractAddress, NebulaContants>();

  const fixedFee = useGasPrice(constants.fixedGas, 'uusd');

  const refetchQueries = useRefetchQueries();

  //const {
  //  constants: { fixedFee, gasWanted, gasAdjustment },
  //  contractAddress,
  //} = useNebulaWebapp();

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
        fixedGas: fixedFee,
        gasWanted: constants.gasWanted,
        gasAdjustment: constants.gasAdjustment,
        mantleEndpoint,
        mantleFetch,
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
      mantleEndpoint,
      mantleFetch,
      refetchQueries,
      txErrorReporter,
    ],
  );

  return connectedWallet ? stream : null;
}
