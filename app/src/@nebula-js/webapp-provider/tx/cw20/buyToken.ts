import { formatExecuteMsgNumber } from '@libs/formatter';
import { CT, HumanAddr, Rate, Token, u, UST } from '@nebula-js/types';
import {
  cw20BuyTokenTx,
  NebulaTax,
  NebulaTokenBalances,
} from '@nebula-js/webapp-fns';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import {
  useBank,
  useRefetchQueries,
  useTerraWebapp,
} from '@libs/webapp-provider';
import big from 'big.js';
import { useCallback } from 'react';
import { useNebulaWebapp } from '../../contexts/webapp';
import { NEBULA_TX_KEYS } from '../../env';
import { useTerraswapPoolQuery } from '../../queries/terraswap/pool';

export interface CW20BuyTokenTxParams {
  buyAmount: u<UST>;
  txFee: u<UST>;

  onTxSucceed?: () => void;
}

export function useCW20BuyTokenTx(
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
    ({ buyAmount, txFee, onTxSucceed }: CW20BuyTokenTxParams) => {
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
        tax,
        maxSpread: '0.1' as Rate,
        buyerAddr: connectedWallet.walletAddress,
        fixedGas,
        gasFee,
        gasAdjustment,
        mantleEndpoint,
        mantleFetch,
        txErrorReporter,
        onTxSucceed: () => {
          onTxSucceed?.();
          refetchQueries(NEBULA_TX_KEYS.CW20_BUY);
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
      tokenSymbol,
      tokenUstPairAddr,
      txErrorReporter,
    ],
  );

  return connectedWallet ? stream : null;
}
