import { useFixedFee, useRefetchQueries } from '@libs/app-provider';
import { govStakeTx } from '@nebula-js/app-fns';
import { NEB, u, UST } from '@nebula-js/types';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useCallback } from 'react';
import { NEBULA_TX_KEYS } from '../../env';
import { useNebulaApp } from '../../hooks/useNebulaApp';

export interface GovStakeTxParams {
  nebAmount: u<NEB>;
  lockForWeeks: number;
  txFee: u<UST>;

  onTxSucceed?: () => void;
}

export function useGovStakeTx() {
  const connectedWallet = useConnectedWallet();

  const { wasmClient, txErrorReporter, constants, contractAddress } =
    useNebulaApp();

  const fixedFee = useFixedFee();

  const refetchQueries = useRefetchQueries();

  const stream = useCallback(
    ({ nebAmount, lockForWeeks, txFee, onTxSucceed }: GovStakeTxParams) => {
      if (!connectedWallet || !connectedWallet.availablePost) {
        throw new Error(`Can't post!`);
      }

      return govStakeTx({
        txFee,
        walletAddr: connectedWallet.walletAddress,
        nebAmount,
        lockForWeeks,
        govAddr: contractAddress.gov,
        nebTokenAddr: contractAddress.cw20.NEB,
        fixedFee,
        gasWanted: constants.gasWanted,
        gasAdjustment: constants.gasAdjustment,
        wasmClient,
        txErrorReporter,
        onTxSucceed: () => {
          onTxSucceed?.();
          refetchQueries(NEBULA_TX_KEYS.GOV_STAKE);
        },
        network: connectedWallet.network,
        post: connectedWallet.post,
      });
    },
    [
      connectedWallet,
      constants.gasAdjustment,
      constants.gasWanted,
      contractAddress.cw20.NEB,
      contractAddress.gov,
      fixedFee,
      refetchQueries,
      txErrorReporter,
      wasmClient,
    ],
  );

  return connectedWallet ? stream : null;
}
