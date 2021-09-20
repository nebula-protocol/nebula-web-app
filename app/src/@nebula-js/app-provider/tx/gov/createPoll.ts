import {
  useApp,
  useGasPrice,
  useRefetchQueries,
  useTax,
} from '@libs/app-provider';
import {
  govCreatePollTx,
  NebulaContants,
  NebulaContractAddress,
} from '@nebula-js/app-fns';
import { gov, NEB, u, UST } from '@nebula-js/types';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useCallback } from 'react';
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

  const {
    mantleFetch,
    mantleEndpoint,
    txErrorReporter,
    constants,
    contractAddress,
  } = useApp<NebulaContractAddress, NebulaContants>();

  const refetchQueries = useRefetchQueries();

  const { taxRate, maxTax } = useTax('uusd');

  const fixedFee = useGasPrice(constants.fixedGas, 'uusd');

  //const { tax } = useBank<NebulaTokenBalances, NebulaTax>();

  //const {
  //  constants: { fixedFee, gasWanted, gasAdjustment },
  //  contractAddress,
  //} = useNebulaWebapp();

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
        taxRate,
        maxTaxUUSD: maxTax,
        fixedGas: fixedFee,
        gasWanted: constants.gasWanted,
        gasAdjustment: constants.gasAdjustment,
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
      constants.gasAdjustment,
      constants.gasWanted,
      contractAddress.cw20.NEB,
      contractAddress.gov,
      fixedFee,
      mantleEndpoint,
      mantleFetch,
      maxTax,
      refetchQueries,
      taxRate,
      txErrorReporter,
    ],
  );

  return connectedWallet ? stream : null;
}
