import { cw20SellTokenTx } from '@libs/app-fns';
import { formatExecuteMsgNumber } from '@libs/formatter';
import { CW20Addr, HumanAddr, Rate, Token, u, UST } from '@libs/types';
import { useConnectedWallet } from '@terra-dev/use-wallet';
import big from 'big.js';
import { useCallback } from 'react';
import { useApp } from '../../contexts/app';
import { TERRA_TX_KEYS } from '../../env';
import { useGasPrice } from '../../hooks/useGasPrice';
import { useRefetchQueries } from '../../hooks/useRefetchQueries';
import { useTax } from '../../queries/terra/tax';
import { useTerraswapPoolQuery } from '../../queries/terraswap/pool';

export interface CW20SellTokenTxParams<T extends Token> {
  sellAmount: u<T>;
  txFee: u<UST>;
  maxSpread: Rate;

  onTxSucceed?: () => void;
}

export function useCW20SellTokenTx<T extends Token>(
  tokenAddr: CW20Addr,
  tokenUstPairAddr: HumanAddr,
  tokenSymbol: string,
) {
  const connectedWallet = useConnectedWallet();

  const { wasmClient, txErrorReporter, constants } = useApp();

  const fixedFee = useGasPrice(constants.fixedGas, 'uusd');

  const refetchQueries = useRefetchQueries();

  const { taxRate, maxTax } = useTax<UST>('uusd');

  const { data: { terraswapPool } = {} } =
    useTerraswapPoolQuery<Token>(tokenUstPairAddr);

  const stream = useCallback(
    ({
      sellAmount,
      txFee,
      maxSpread,
      onTxSucceed,
    }: CW20SellTokenTxParams<T>) => {
      if (
        !connectedWallet ||
        !connectedWallet.availablePost ||
        !terraswapPool
      ) {
        throw new Error(`Can't post!`);
      }

      const tokenPoolSize = terraswapPool.assets[0]?.amount as u<Token>;
      const ustPoolSize = terraswapPool.assets[1]?.amount as u<UST>;

      return cw20SellTokenTx<T>({
        txFee,
        sellAmount,
        beliefPrice: formatExecuteMsgNumber(
          big(tokenPoolSize).div(ustPoolSize),
        ) as T,
        tokenAddr,
        tokenUstPairAddr,
        tokenSymbol,
        taxRate,
        maxTaxUUSD: maxTax,
        maxSpread,
        sellerAddr: connectedWallet.walletAddress,
        fixedFee,
        gasWanted: constants.gasWanted,
        gasAdjustment: constants.gasAdjustment,
        wasmClient,
        txErrorReporter,
        onTxSucceed: () => {
          onTxSucceed?.();
          refetchQueries(TERRA_TX_KEYS.CW20_SELL);
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
      maxTax,
      refetchQueries,
      taxRate,
      terraswapPool,
      tokenAddr,
      tokenSymbol,
      tokenUstPairAddr,
      txErrorReporter,
      wasmClient,
    ],
  );

  return connectedWallet ? stream : null;
}