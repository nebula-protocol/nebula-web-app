import { formatExecuteMsgNumber } from '@nebula-js/notation';
import { CT, CW20Addr, HumanAddr, Rate, Token, u, UST } from '@nebula-js/types';
import {
  cw20SellTokenTx,
  NebulaTax,
  NebulaTokenBalances,
} from '@nebula-js/webapp-fns';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import {
  useBank,
  useRefetchQueries,
  useTerraWebapp,
} from '@packages/webapp-provider';
import big from 'big.js';
import { useCallback } from 'react';
import { useNebulaWebapp } from '../../contexts/webapp';
import { NEBULA_TX_KEYS } from '../../env';
import { useTerraswapPoolQuery } from '../../queries/terraswap/pool';

export interface CW20SellTokenTxParams<T extends Token> {
  sellAmount: u<T>;
  txFee: u<UST>;

  onTxSucceed?: () => void;
}

export function useCW20SellTokenTx<T extends Token>(
  tokenAddr: CW20Addr,
  tokenUstPairAddr: HumanAddr,
  tokenSymbol: string,
) {
  const connectedWallet = useConnectedWallet();

  const { mantleFetch, mantleEndpoint, txErrorReporter } = useTerraWebapp();

  const refetchQueries = useRefetchQueries();

  const { tax } = useBank<NebulaTokenBalances, NebulaTax>();

  const {
    constants: { fixedGas, gasFee, gasAdjustment },
  } = useNebulaWebapp();

  const { data: { terraswapPool } = {} } =
    useTerraswapPoolQuery<CT>(tokenUstPairAddr);

  const stream = useCallback(
    ({ sellAmount, txFee, onTxSucceed }: CW20SellTokenTxParams<T>) => {
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
        tax,
        maxSpread: '0.1' as Rate,
        sellerAddr: connectedWallet.walletAddress,
        fixedGas,
        gasFee,
        gasAdjustment,
        mantleEndpoint,
        mantleFetch,
        txErrorReporter,
        onTxSucceed: () => {
          onTxSucceed?.();
          refetchQueries(NEBULA_TX_KEYS.CW20_SELL);
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
      terraswapPool,
      tokenAddr,
      tokenSymbol,
      tokenUstPairAddr,
      txErrorReporter,
    ],
  );

  return connectedWallet ? stream : null;
}
