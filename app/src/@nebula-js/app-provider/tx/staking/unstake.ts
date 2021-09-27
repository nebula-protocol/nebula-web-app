import { useFixedFee, useRefetchQueries } from '@libs/app-provider';
import { stakingUnstakeTx } from '@nebula-js/app-fns';
import { CW20Addr, HumanAddr, LP, LPAddr, u, UST } from '@nebula-js/types';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useCallback } from 'react';
import { NEBULA_TX_KEYS } from '../../env';
import { useNebulaApp } from '../../hooks/useNebulaApp';

export interface StakingUnstakeTxParams {
  lpAmount: u<LP>;
  txFee: u<UST>;

  onTxSucceed?: () => void;
}

export function useStakingUnstakeTx(
  tokenAddr: CW20Addr,
  tokenUstPairAddr: HumanAddr,
  lpAddr: LPAddr,
) {
  const connectedWallet = useConnectedWallet();

  const { wasmClient, txErrorReporter, constants, contractAddress } =
    useNebulaApp();

  const fixedFee = useFixedFee();

  const refetchQueries = useRefetchQueries();

  const stream = useCallback(
    ({ lpAmount, txFee, onTxSucceed }: StakingUnstakeTxParams) => {
      if (!connectedWallet || !connectedWallet.availablePost) {
        throw new Error(`Can't post!`);
      }

      return stakingUnstakeTx({
        txFee,
        walletAddr: connectedWallet.walletAddress,
        lpAmount,
        lpAddr,
        stakingAddr: contractAddress.staking,
        tokenAddr,
        tokenUstPairAddr,
        fixedFee,
        gasWanted: constants.gasWanted,
        gasAdjustment: constants.gasAdjustment,
        wasmClient,
        txErrorReporter,
        //terraswapPoolAddr: contractAddress.terraswap
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
      lpAddr,
      refetchQueries,
      tokenAddr,
      tokenUstPairAddr,
      txErrorReporter,
      wasmClient,
    ],
  );

  return connectedWallet ? stream : null;
}
