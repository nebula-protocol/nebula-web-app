import { Airdrop, airdropClaimTx } from '@nebula-js/app-fns';
import { useGasPrice, useRefetchQueries } from '@libs/app-provider';
import { u, Luna } from '@libs/types';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useCallback } from 'react';
import { useNebulaApp } from '@nebula-js/app-provider/hooks/useNebulaApp';
import { NEBULA_TX_KEYS } from '../../env';

export interface AirdropClaimTxParams {
  airdrop: Airdrop;

  onTxSucceed?: () => void;
}

export function useAirdropClaimTx() {
  const connectedWallet = useConnectedWallet();

  const { queryClient, txErrorReporter, constants, contractAddress } =
    useNebulaApp();

  const airdropFee = useGasPrice(constants.airdropGas, 'uluna');

  const refetchQueries = useRefetchQueries();

  const stream = useCallback(
    ({ airdrop, onTxSucceed }: AirdropClaimTxParams) => {
      if (!connectedWallet || !connectedWallet.availablePost) {
        throw new Error('Can not post!');
      }

      return airdropClaimTx({
        airdrop,
        airdropContract: contractAddress.airdrop,
        walletAddress: connectedWallet.walletAddress,
        // post
        network: connectedWallet.network,
        post: connectedWallet.post,
        gasAdjustment: constants.gasAdjustment,
        gasFee: constants.airdropGasWanted,
        txFee: airdropFee as u<Luna>,
        // query
        queryClient,
        // error
        txErrorReporter,
        // side effect
        onTxSucceed: () => {
          onTxSucceed?.();
          refetchQueries(NEBULA_TX_KEYS.AIRDROP_CLAIM);
        },
      });
    },
    [
      connectedWallet,
      contractAddress.airdrop,
      constants.gasAdjustment,
      constants.airdropGasWanted,
      airdropFee,
      queryClient,
      txErrorReporter,
      refetchQueries,
    ],
  );

  return connectedWallet ? stream : null;
}
