import { useRefetchQueries } from '@libs/app-provider';
import { useGovFee } from '@nebula-js/app-provider';
import { govStakeTx } from '@nebula-js/app-fns';
import { NEB, u, UST } from '@nebula-js/types';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useCallback } from 'react';
import { NEBULA_TX_KEYS } from '../../env';
import { useNebulaApp } from '../../hooks/useNebulaApp';

export interface GovStakeTxParams {
  nebAmount: u<NEB>;
  txFee: u<UST>;

  onTxSucceed?: () => void;
}

export function useGovStakeTx() {
  const connectedWallet = useConnectedWallet();

  const { queryClient, txErrorReporter, constants, contractAddress } =
    useNebulaApp();

  const fixedFee = useGovFee();

  const refetchQueries = useRefetchQueries();

  const stream = useCallback(
    ({ nebAmount, txFee, onTxSucceed }: GovStakeTxParams) => {
      if (!connectedWallet || !connectedWallet.availablePost) {
        throw new Error(`Can't post!`);
      }

      return govStakeTx({
        txFee,
        walletAddr: connectedWallet.walletAddress,
        nebAmount,
        govAddr: contractAddress.gov,
        nebTokenAddr: contractAddress.cw20.NEB,
        fixedFee,
        gasWanted: constants.govGas,
        gasAdjustment: constants.gasAdjustment,
        queryClient,
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
      constants.govGas,
      contractAddress.cw20.NEB,
      contractAddress.gov,
      fixedFee,
      refetchQueries,
      txErrorReporter,
      queryClient,
    ],
  );

  return connectedWallet ? stream : null;
}
