import { CW20Addr, HumanAddr, LP, LPAddr, u, UST } from '@nebula-js/types';
import { stakingUnstakeTx } from '@nebula-js/webapp-fns';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useRefetchQueries, useTerraWebapp } from '@libs/webapp-provider';
import { useCallback } from 'react';
import { useNebulaWebapp } from '../../contexts/webapp';
import { NEBULA_TX_KEYS } from '../../env';

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

  const { mantleFetch, mantleEndpoint, txErrorReporter } = useTerraWebapp();

  const refetchQueries = useRefetchQueries();

  const {
    constants: { fixedGas, gasFee, gasAdjustment },
    contractAddress,
  } = useNebulaWebapp();

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
        fixedGas,
        gasFee,
        gasAdjustment,
        mantleEndpoint,
        mantleFetch,
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
      contractAddress.staking,
      fixedGas,
      gasAdjustment,
      gasFee,
      lpAddr,
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
