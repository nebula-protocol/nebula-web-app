import { useFixedFee, useRefetchQueries } from '@libs/app-provider';
import { u, Luna } from '@nebula-js/types';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useCallback } from 'react';
import { claimAllRewardsTx } from '@nebula-js/app-fns';
import { useNebulaApp, NEBULA_TX_KEYS } from '@nebula-js/app-provider';

export interface ClaimAllRewardTxParams {
  claimStaking: boolean;
  claimGov: boolean;
  claimIncentive: boolean;

  onTxSucceed?: () => void;
}

export function useClaimAllRewardsTx() {
  const connectedWallet = useConnectedWallet();

  const { queryClient, txErrorReporter, constants, contractAddress } =
    useNebulaApp();

  const refetchQueries = useRefetchQueries();

  const fixedFee = useFixedFee();

  const stream = useCallback(
    ({
      claimStaking,
      claimGov,
      claimIncentive,
      onTxSucceed,
    }: ClaimAllRewardTxParams) => {
      if (!connectedWallet || !connectedWallet.availablePost) {
        throw new Error(`Can't post!`);
      }

      return claimAllRewardsTx({
        txFee: fixedFee.toString() as u<Luna>,
        govAddr: contractAddress.gov,
        stakingAddr: contractAddress.staking,
        incentiveAddr: contractAddress.incentives,
        claimStaking,
        claimGov,
        claimIncentive,
        walletAddr: connectedWallet.walletAddress,
        fixedFee,
        gasWanted: constants.gasWanted,
        gasAdjustment: constants.gasAdjustment,
        queryClient,
        txErrorReporter,
        onTxSucceed: () => {
          onTxSucceed?.();
          refetchQueries(NEBULA_TX_KEYS.CLAIM_ALL_REWARDS);
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
      contractAddress.staking,
      contractAddress.incentives,
      fixedFee,
      refetchQueries,
      txErrorReporter,
      queryClient,
    ],
  );

  return connectedWallet ? stream : null;
}
