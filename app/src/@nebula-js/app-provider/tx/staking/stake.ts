import { useFixedFee, useRefetchQueries } from '@libs/app-provider';
import { stakingStakeTx } from '@nebula-js/app-fns';
import { CW20Addr, HumanAddr, Rate, Token, u, UST } from '@nebula-js/types';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useCallback } from 'react';
import { NEBULA_TX_KEYS } from '../../env';
import { useNebulaApp } from '../../hooks/useNebulaApp';

export interface StakingStakeTxParams {
  ustAmount: u<UST>;
  tokenAmount: u<Token>;
  txFee: u<UST>;
  slippageTolerance: Rate;

  onTxSucceed?: () => void;
}

export function useStakingStakeTx(
  tokenAddr: CW20Addr,
  tokenUstPairAddr: HumanAddr,
) {
  const connectedWallet = useConnectedWallet();

  const { queryClient, txErrorReporter, constants, contractAddress } =
    useNebulaApp();

  const fixedFee = useFixedFee();

  const refetchQueries = useRefetchQueries();

  const stream = useCallback(
    ({
      ustAmount,
      tokenAmount,
      txFee,
      slippageTolerance,
      onTxSucceed,
    }: StakingStakeTxParams) => {
      if (!connectedWallet || !connectedWallet.availablePost) {
        throw new Error(`Can't post!`);
      }

      return stakingStakeTx({
        txFee,
        walletAddr: connectedWallet.walletAddress,
        ustAmount,
        tokenAmount,
        stakingAddr: contractAddress.staking,
        tokenAddr,
        tokenUstPairAddr,
        fixedFee,
        gasWanted: constants.gasWanted,
        slippageTolerance,
        gasAdjustment: constants.gasAdjustment,
        queryClient,
        txErrorReporter,
        onTxSucceed: () => {
          onTxSucceed?.();
          refetchQueries(NEBULA_TX_KEYS.STAKING_STAKE);
        },
        network: connectedWallet.network,
        post: connectedWallet.post,
      });
    },
    [
      connectedWallet,
      constants.gasAdjustment,
      constants.gasWanted,
      contractAddress.staking,
      fixedFee,
      refetchQueries,
      tokenAddr,
      tokenUstPairAddr,
      txErrorReporter,
      queryClient,
    ],
  );

  return connectedWallet ? stream : null;
}
