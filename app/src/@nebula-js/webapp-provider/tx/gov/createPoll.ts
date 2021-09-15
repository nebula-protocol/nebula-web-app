import { gov, NEB, u, UST } from '@nebula-js/types';
import {
  govCreatePollTx,
  NebulaTax,
  NebulaTokenBalances,
} from '@nebula-js/webapp-fns';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import {
  useBank,
  useRefetchQueries,
  useTerraWebapp,
} from '@libs/webapp-provider';
import { useCallback } from 'react';
import { useNebulaWebapp } from '../../contexts/webapp';
import { NEBULA_TX_KEYS } from '../../env';

export interface GovCreatePollTxParams {
  depositAmount: u<NEB>;
  title: string;
  description: string;
  link?: string;
  execute_msg?: gov.ExecuteMsg;

  onTxSucceed?: () => void;
}

export function useGovCreatePollTx() {
  const connectedWallet = useConnectedWallet();

  const { mantleFetch, mantleEndpoint, txErrorReporter } = useTerraWebapp();

  const refetchQueries = useRefetchQueries();

  const { tax } = useBank<NebulaTokenBalances, NebulaTax>();

  const {
    constants: { fixedFee, gasWanted, gasAdjustment },
    contractAddress,
  } = useNebulaWebapp();

  const stream = useCallback(
    ({
      depositAmount,
      title,
      description,
      link,
      execute_msg,
      onTxSucceed,
    }: GovCreatePollTxParams) => {
      if (!connectedWallet || !connectedWallet.availablePost) {
        throw new Error(`Can't post!`);
      }

      return govCreatePollTx({
        txFee: fixedFee.toString() as u<UST>,
        depositAmount,
        title,
        description,
        link,
        execute_msg,
        govAddr: contractAddress.gov,
        nebTokenAddr: contractAddress.cw20.NEB,
        walletAddr: connectedWallet.walletAddress,
        tax,
        fixedGas: fixedFee,
        gasWanted,
        gasAdjustment,
        mantleEndpoint,
        mantleFetch,
        txErrorReporter,
        onTxSucceed: () => {
          onTxSucceed?.();
          refetchQueries(NEBULA_TX_KEYS.GOV_CREATE_POLL);
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
      tax,
      txErrorReporter,
    ],
  );

  return connectedWallet ? stream : null;
}
