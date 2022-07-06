import { useFixedFee, useRefetchQueries, useUstTax } from '@libs/app-provider';
import { govCreatePollTx } from '@nebula-js/app-fns';
import { gov, NEB, u, Luna } from '@nebula-js/types';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useCallback } from 'react';
import { NEBULA_TX_KEYS } from '../../env';
import { useNebulaApp } from '../../hooks/useNebulaApp';

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

  const { queryClient, txErrorReporter, constants, contractAddress } =
    useNebulaApp();

  const refetchQueries = useRefetchQueries();

  const { taxRate, maxTax } = useUstTax();

  const fixedFee = useFixedFee();

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
        txFee: fixedFee.toString() as u<Luna>,
        depositAmount,
        title,
        description,
        link,
        execute_msg,
        govAddr: contractAddress.gov,
        nebTokenAddr: contractAddress.cw20.NEB,
        walletAddr: connectedWallet.walletAddress,
        taxRate,
        maxTaxUUSD: maxTax,
        fixedFee,
        gasWanted: constants.gasWanted,
        gasAdjustment: constants.gasAdjustment,
        queryClient,
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
      constants.gasAdjustment,
      constants.gasWanted,
      contractAddress.cw20.NEB,
      contractAddress.gov,
      fixedFee,
      maxTax,
      refetchQueries,
      taxRate,
      txErrorReporter,
      queryClient,
    ],
  );

  return connectedWallet ? stream : null;
}
