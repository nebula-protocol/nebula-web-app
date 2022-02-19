import { cw20SellTokenTx } from '@libs/app-fns';
import { useFixedFee } from '@libs/app-provider/hooks/useFixedFee';
import big from 'big.js';
import { formatExecuteMsgNumber } from '@libs/formatter';
import { CW20Addr, HumanAddr, Rate, Token, u, UST } from '@libs/types';
import { useConnectedWallet } from '@terra-money/use-wallet';
import { useCallback } from 'react';
import { useApp } from '../../contexts/app';
import { TERRA_TX_KEYS } from '../../env';
import { useRefetchQueries } from '../../hooks/useRefetchQueries';
import { useUstTax } from '../../queries/terra/tax';
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

  const { queryClient, txErrorReporter, constants } = useApp();

  const fixedFee = useFixedFee();

  const refetchQueries = useRefetchQueries();

  const { taxRate, maxTax } = useUstTax();

  const { data: { terraswapPoolInfo } = {} } =
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
        !terraswapPoolInfo
      ) {
        throw new Error(`Can't post!`);
      }

      return cw20SellTokenTx<T>({
        txFee,
        sellAmount,
        beliefPrice: formatExecuteMsgNumber(
          big(1).div(terraswapPoolInfo.tokenPrice),
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
        queryClient,
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
      terraswapPoolInfo,
      tokenAddr,
      tokenSymbol,
      tokenUstPairAddr,
      txErrorReporter,
      queryClient,
    ],
  );

  return connectedWallet ? stream : null;
}
