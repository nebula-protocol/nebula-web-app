import { CW20Addr, HumanAddr, Token, u, UST } from '@nebula-js/types';
import { stakingStakeTx } from '@nebula-js/webapp-fns';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useRefetchQueries, useTerraWebapp } from '@packages/webapp-provider';
import { useCallback } from 'react';
import { useNebulaWebapp } from '../../contexts/webapp';
import { NEBULA_TX_KEYS } from '../../env';

export interface StakingStakeTxParams {
  ustAmount: u<UST>;
  tokenAmount: u<Token>;
  txFee: u<UST>;

  onTxSucceed?: () => void;
}

export function useStakingStakeTx(
  tokenAddr: CW20Addr,
  tokenUstPairAddr: HumanAddr,
) {
  const connectedWallet = useConnectedWallet();

  const { mantleFetch, mantleEndpoint, txErrorReporter } = useTerraWebapp();

  const refetchQueries = useRefetchQueries();

  const {
    constants: { fixedGas, gasFee, gasAdjustment },
    contractAddress,
  } = useNebulaWebapp();

  const stream = useCallback(
    ({ ustAmount, tokenAmount, txFee, onTxSucceed }: StakingStakeTxParams) => {
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
        fixedGas,
        gasFee,
        gasAdjustment,
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
      contractAddress.staking,
      fixedGas,
      gasAdjustment,
      gasFee,
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
