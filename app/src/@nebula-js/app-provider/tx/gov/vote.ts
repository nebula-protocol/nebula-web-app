import { useApp, useGasPrice, useRefetchQueries } from '@libs/app-provider';
import {
  govVoteTx,
  NebulaContants,
  NebulaContractAddress,
} from '@nebula-js/app-fns';
import { gov, NEB, u, UST } from '@nebula-js/types';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useCallback } from 'react';
import { NEBULA_TX_KEYS } from '../../env';

export interface GovVoteTxParams {
  vote: gov.VoteOption;
  amount: u<NEB>;

  onTxSucceed?: () => void;
}

export function useGovVoteTx(pollId: number) {
  const connectedWallet = useConnectedWallet();

  const {
    mantleFetch,
    mantleEndpoint,
    txErrorReporter,
    constants,
    contractAddress,
  } = useApp<NebulaContractAddress, NebulaContants>();

  const fixedFee = useGasPrice(constants.fixedGas, 'uusd');

  const refetchQueries = useRefetchQueries();

  //const {
  //  constants: { fixedFee, gasWanted, gasAdjustment },
  //  contractAddress,
  //} = useNebulaWebapp();

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
        fixedGas: fixedFee,
        gasWanted: constants.gasWanted,
        gasAdjustment: constants.gasAdjustment,
        mantleEndpoint,
        mantleFetch,
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
      mantleEndpoint,
      mantleFetch,
      pollId,
      refetchQueries,
      txErrorReporter,
    ],
  );

  return connectedWallet ? stream : null;
}
