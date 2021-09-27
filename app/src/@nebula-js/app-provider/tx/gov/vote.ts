import { useFixedFee, useRefetchQueries } from '@libs/app-provider';
import { govVoteTx } from '@nebula-js/app-fns';
import { gov, NEB, u, UST } from '@nebula-js/types';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useCallback } from 'react';
import { NEBULA_TX_KEYS } from '../../env';
import { useNebulaApp } from '../../hooks/useNebulaApp';

export interface GovVoteTxParams {
  vote: gov.VoteOption;
  amount: u<NEB>;

  onTxSucceed?: () => void;
}

export function useGovVoteTx(pollId: number) {
  const connectedWallet = useConnectedWallet();

  const { wasmClient, txErrorReporter, constants, contractAddress } =
    useNebulaApp();

  const fixedFee = useFixedFee();

  const refetchQueries = useRefetchQueries();

  const stream = useCallback(
    ({ vote, amount, onTxSucceed }: GovVoteTxParams) => {
      if (!connectedWallet || !connectedWallet.availablePost) {
        throw new Error(`Can't post!`);
      }

      return govVoteTx({
        txFee: fixedFee.toString() as u<UST>,
        walletAddr: connectedWallet.walletAddress,
        vote,
        amount,
        pollId,
        govAddr: contractAddress.gov,
        fixedFee,
        gasWanted: constants.gasWanted,
        gasAdjustment: constants.gasAdjustment,
        wasmClient,
        txErrorReporter,
        onTxSucceed: () => {
          onTxSucceed?.();
          refetchQueries(NEBULA_TX_KEYS.GOV_VOTE);
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
      pollId,
      refetchQueries,
      txErrorReporter,
      wasmClient,
    ],
  );

  return connectedWallet ? stream : null;
}
