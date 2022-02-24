import { useFixedFee, useRefetchQueries } from '@libs/app-provider';
import { u, UST, NEB } from '@nebula-js/types';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useCallback } from 'react';
import { NEBULA_TX_KEYS } from '../..';
import { govRestakeRewardsTx } from '@nebula-js/app-fns';
import { useNebulaApp } from '../../hooks/useNebulaApp';

export interface GovRestakeTxParams {
  rewardAmount: u<NEB>;
}

export function useGovRestakeRewardsTx() {
  const connectedWallet = useConnectedWallet();

  const { queryClient, txErrorReporter, constants, contractAddress } =
    useNebulaApp();

  const refetchQueries = useRefetchQueries();

  const fixedFee = useFixedFee();

  const stream = useCallback(
    ({ rewardAmount }: GovRestakeTxParams) => {
      if (!connectedWallet || !connectedWallet.availablePost) {
        throw new Error(`Can't post!`);
      }

      return govRestakeRewardsTx({
        walletAddr: connectedWallet.walletAddress,
        txFee: fixedFee.toString() as u<UST>,
        govAddr: contractAddress.gov,
        nebTokenAddr: contractAddress.cw20.NEB,
        rewardAmount,
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
    },
    [
      connectedWallet,
      constants.gasAdjustment,
      constants.gasWanted,
      contractAddress.gov,
      contractAddress.cw20.NEB,
      fixedFee,
      refetchQueries,
      txErrorReporter,
      queryClient,
    ],
  );

  return connectedWallet ? stream : null;
}
