import { useApp, useGasPrice, useRefetchQueries } from '@libs/app-provider';
import {
  NebulaContants,
  NebulaContractAddress,
  stakingStakeTx,
} from '@nebula-js/app-fns';
import { CW20Addr, HumanAddr, Rate, Token, u, UST } from '@nebula-js/types';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useCallback } from 'react';
import { NEBULA_TX_KEYS } from '../../env';

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
        fixedGas: fixedFee,
        gasWanted: constants.gasWanted,
        slippageTolerance,
        gasAdjustment: constants.gasAdjustment,
        mantleEndpoint,
        mantleFetch,
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
      mantleEndpoint,
      mantleFetch,
      refetchQueries,
      tokenAddr,
      tokenUstPairAddr,
      txErrorReporter,
    ],
  );

  return connectedWallet ? stream : null;
}
