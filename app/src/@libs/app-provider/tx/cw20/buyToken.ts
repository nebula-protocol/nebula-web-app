import { cw20BuyTokenTx } from '@libs/app-fns';
import {
  TERRA_TX_KEYS,
  useGasPrice,
  useRefetchQueries,
} from '@libs/app-provider';
import { useApp } from '@libs/app-provider/contexts/app';
import { useTax } from '@libs/app-provider/queries/terra/tax';
import { formatExecuteMsgNumber } from '@libs/formatter';
import { HumanAddr, Rate, Token, u, UST } from '@libs/types';
import { useConnectedWallet } from '@terra-dev/use-wallet';
import big from 'big.js';
import { useCallback } from 'react';
import { useTerraswapPoolQuery } from '../../queries/terraswap/pool';

export interface CW20BuyTokenTxParams {
  buyAmount: u<UST>;
  txFee: u<UST>;
  maxSpread: Rate;

  onTxSucceed?: () => void;
}

export function useCW20BuyTokenTx(
  tokenUstPairAddr: HumanAddr,
  tokenSymbol: string,
) {
  const connectedWallet = useConnectedWallet();

  const { mantleFetch, mantleEndpoint, txErrorReporter, constants } = useApp();

  const fixedFee = useGasPrice(constants.fixedGas, 'uusd');

  const refetchQueries = useRefetchQueries();

  const { taxRate, maxTax } = useTax<UST>('uusd');

  const { data: { terraswapPool } = {} } =
    useTerraswapPoolQuery<Token>(tokenUstPairAddr);

  const stream = useCallback(
    ({ buyAmount, txFee, maxSpread, onTxSucceed }: CW20BuyTokenTxParams) => {
      if (
        !connectedWallet ||
        !connectedWallet.availablePost ||
        !terraswapPool
      ) {
        throw new Error(`Can't post!`);
      }

      const tokenPoolSize = terraswapPool.assets[0]?.amount as u<Token>;
      const ustPoolSize = terraswapPool.assets[1]?.amount as u<UST>;

      return cw20BuyTokenTx({
        txFee,
        buyAmount,
        beliefPrice: formatExecuteMsgNumber(
          big(ustPoolSize).div(tokenPoolSize),
        ) as UST,
        tokenUstPairAddr,
        tokenSymbol,
        taxRate,
        maxTaxUUSD: maxTax,
        maxSpread,
        buyerAddr: connectedWallet.walletAddress,
        fixedGas: fixedFee,
        gasWanted: constants.gasWanted,
        gasAdjustment: constants.gasAdjustment,
        mantleEndpoint,
        mantleFetch,
        txErrorReporter,
        onTxSucceed: () => {
          onTxSucceed?.();
          refetchQueries(TERRA_TX_KEYS.CW20_BUY);
        },
        network: connectedWallet.network,
        post: connectedWallet.post,
      });
    },
    [
      connectedWallet,
      constants.gasAdjustment,
      constants.gasWanted,
      fixedFee,
      mantleEndpoint,
      mantleFetch,
      maxTax,
      refetchQueries,
      taxRate,
      terraswapPool,
      tokenSymbol,
      tokenUstPairAddr,
      txErrorReporter,
    ],
  );

  return connectedWallet ? stream : null;
}
