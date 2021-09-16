import { NEB, u, UST } from '@nebula-js/types';
import { govStakeTx } from '@nebula-js/webapp-fns';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useRefetchQueries, useTerraWebapp } from '@libs/app-provider';
import { useCallback } from 'react';
import { useNebulaWebapp } from '../../contexts/webapp';
import { NEBULA_TX_KEYS } from '../../env';

export interface GovStakeTxParams {
  nebAmount: u<NEB>;
  lockForWeeks: number;
  txFee: u<UST>;

  onTxSucceed?: () => void;
}

export function useGovStakeTx() {
  const connectedWallet = useConnectedWallet();

  const { mantleFetch, mantleEndpoint, txErrorReporter } = useTerraWebapp();

  const refetchQueries = useRefetchQueries();

  const {
    constants: { fixedFee, gasWanted, gasAdjustment },
    contractAddress,
  } = useNebulaWebapp();

  const stream = useCallback(
    ({ nebAmount, lockForWeeks, txFee, onTxSucceed }: GovStakeTxParams) => {
      if (!connectedWallet || !connectedWallet.availablePost) {
        throw new Error(`Can't post!`);
      }

      return govStakeTx({
        txFee,
        walletAddr: connectedWallet.walletAddress,
        nebAmount,
        lockForWeeks,
        govAddr: contractAddress.gov,
        nebTokenAddr: contractAddress.cw20.NEB,
        fixedGas: fixedFee,
        gasWanted,
        gasAdjustment,
        mantleEndpoint,
        mantleFetch,
        txErrorReporter,
        onTxSucceed: () => {
          onTxSucceed?.();
          refetchQueries(NEBULA_TX_KEYS.GOV_STAKE);
        },
        network: connectedWallet.network,
        post: connectedWallet.post,
      });
    },
    [
      connectedWallet,
      contractAddress.cw20.NEB,
      contractAddress.gov,
      fixedFee,
      gasAdjustment,
      gasWanted,
      mantleEndpoint,
      mantleFetch,
      refetchQueries,
      txErrorReporter,
    ],
  );

  return connectedWallet ? stream : null;
}
