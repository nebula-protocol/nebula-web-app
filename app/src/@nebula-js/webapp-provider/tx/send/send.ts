import { HumanAddr, terraswap, Token, u, UST } from '@nebula-js/types';
import { NebulaTax, NebulaTokenBalances, sendTx } from '@nebula-js/webapp-fns';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import {
  useBank,
  useRefetchQueries,
  useTerraWebapp,
} from '@packages/webapp-provider';
import { useCallback } from 'react';
import { useNebulaWebapp } from '../../contexts/webapp';
import { NEBULA_TX_KEYS } from '../../env';

export interface SendTxParams {
  amount: u<Token>;
  toAddr: HumanAddr;
  asset: terraswap.AssetInfo;
  memo?: string;
  txFee: u<UST>;

  onTxSucceed?: () => void;
}

export function useSendTx() {
  const connectedWallet = useConnectedWallet();

  const { mantleFetch, mantleEndpoint, txErrorReporter } = useTerraWebapp();

  const refetchQueries = useRefetchQueries();

  const { tax } = useBank<NebulaTokenBalances, NebulaTax>();

  const {
    constants: { fixedGas, gasFee, gasAdjustment },
  } = useNebulaWebapp();

  const stream = useCallback(
    ({ asset, memo, toAddr, amount, txFee, onTxSucceed }: SendTxParams) => {
      if (!connectedWallet || !connectedWallet.availablePost) {
        throw new Error(`Can't post!`);
      }

      return sendTx({
        txFee,
        asset,
        memo,
        toAddr,
        amount,
        walletAddr: connectedWallet.walletAddress,
        tax,
        fixedGas,
        gasFee,
        gasAdjustment,
        mantleEndpoint,
        mantleFetch,
        txErrorReporter,
        onTxSucceed: () => {
          onTxSucceed?.();
          refetchQueries(NEBULA_TX_KEYS.SEND);
        },
        network: connectedWallet.network,
        post: connectedWallet.post,
      });
    },
    [
      connectedWallet,
      fixedGas,
      gasAdjustment,
      gasFee,
      mantleEndpoint,
      mantleFetch,
      refetchQueries,
      tax,
      txErrorReporter,
    ],
  );

  return connectedWallet ? stream : null;
}
