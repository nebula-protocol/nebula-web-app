import { useFixedFee, useRefetchQueries } from '@libs/app-provider';
import { u, UST } from '@nebula-js/types';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useCallback } from 'react';
import { claimIncentiveRewardsTx } from '@nebula-js/app-fns';
import { useNebulaApp, NEBULA_TX_KEYS } from '@nebula-js/app-provider';

export function useClaimIncentiveRewardsTx() {
  const connectedWallet = useConnectedWallet();

  const { queryClient, txErrorReporter, constants, contractAddress } =
    useNebulaApp();

  const refetchQueries = useRefetchQueries();

  const fixedFee = useFixedFee();

  const stream = useCallback(() => {
    if (!connectedWallet || !connectedWallet.availablePost) {
      throw new Error(`Can't post!`);
    }

    return claimIncentiveRewardsTx({
      txFee: fixedFee.toString() as u<UST>,
      incentiveAddr: contractAddress.incentives,
      walletAddr: connectedWallet.walletAddress,
      fixedFee,
      gasWanted: constants.gasWanted,
      gasAdjustment: constants.gasAdjustment,
      queryClient,
      txErrorReporter,
      onTxSucceed: () => {
        refetchQueries(NEBULA_TX_KEYS.CLAIM_INCENTIVE_REWARD);
      },
      network: connectedWallet.network,
      post: connectedWallet.post,
    });
  }, [
    connectedWallet,
    constants.gasAdjustment,
    constants.gasWanted,
    contractAddress.incentives,
    fixedFee,
    refetchQueries,
    txErrorReporter,
    queryClient,
  ]);

  return connectedWallet ? stream : null;
}
