import { useFixedFee, useRefetchQueries } from '@libs/app-provider';
import { u, Luna } from '@nebula-js/types';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useCallback } from 'react';
import { NEBULA_TX_KEYS } from '../..';
import { govClaimRewardsTx } from '@nebula-js/app-fns';
import { useNebulaApp } from '../../hooks/useNebulaApp';

export function useGovClaimRewardsTx() {
  const connectedWallet = useConnectedWallet();

  const { queryClient, txErrorReporter, constants, contractAddress } =
    useNebulaApp();

  const refetchQueries = useRefetchQueries();

  const fixedFee = useFixedFee();

  const stream = useCallback(() => {
    if (!connectedWallet || !connectedWallet.availablePost) {
      throw new Error(`Can't post!`);
    }

    return govClaimRewardsTx({
      txFee: fixedFee.toString() as u<Luna>,
      govAddr: contractAddress.gov,
      walletAddr: connectedWallet.walletAddress,
      fixedFee,
      gasWanted: constants.gasWanted,
      gasAdjustment: constants.gasAdjustment,
      queryClient,
      txErrorReporter,
      onTxSucceed: () => {
        refetchQueries(NEBULA_TX_KEYS.GOV_CLAIM_REWARD);
      },
      network: connectedWallet.network,
      post: connectedWallet.post,
    });
  }, [
    connectedWallet,
    constants.gasAdjustment,
    constants.gasWanted,
    contractAddress.gov,
    fixedFee,
    refetchQueries,
    txErrorReporter,
    queryClient,
  ]);

  return connectedWallet ? stream : null;
}
