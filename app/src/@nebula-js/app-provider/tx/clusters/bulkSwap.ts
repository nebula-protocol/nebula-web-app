import { cw20BuyTokenChuckTx } from '@nebula-js/app-fns/tx/clusters/bulkSwap';
import { useFixedFee } from '@libs/app-provider/hooks/useFixedFee';
import { Rate, u, UST } from '@libs/types';
import { useConnectedWallet } from '@terra-money/use-wallet';
import { useCallback } from 'react';
import { useNebulaApp } from '@nebula-js/app-provider';
import { NEBULA_TX_KEYS } from '../../env';
import { useRefetchQueries, useUstTax } from '@libs/app-provider';
import { SwapTokenInfo } from '@nebula-js/app-fns';
import { useMintBasic } from 'contexts/mint-basic';
import { computeBulkSwapGasWanted } from '@nebula-js/app-fns';

export interface CW20BuyTokenChuckTxParams {
  buyTokens: SwapTokenInfo[];
  txFee: u<UST>;

  onTxSucceed?: () => void;
}

export function useCW20BuyTokenChuckTx() {
  const connectedWallet = useConnectedWallet();

  const { onSwapSucceed } = useMintBasic();

  const { queryClient, txErrorReporter, constants } = useNebulaApp();

  const fixedFee = useFixedFee();

  const refetchQueries = useRefetchQueries();

  const { taxRate, maxTax } = useUstTax();

  const stream = useCallback(
    ({ buyTokens, txFee, onTxSucceed }: CW20BuyTokenChuckTxParams) => {
      if (!connectedWallet || !connectedWallet.availablePost) {
        throw new Error(`Can't post!`);
      }

      return cw20BuyTokenChuckTx({
        txFee,
        buyTokens,
        onSwapSucceed,
        taxRate,
        maxTaxUUSD: maxTax,
        // TODO: hardcode maxSpread
        maxSpread: '0.01' as Rate,
        buyerAddr: connectedWallet.walletAddress,
        fixedFee,
        gasWanted: computeBulkSwapGasWanted(
          constants.swapGasWantedPerAsset,
          buyTokens.length,
        ),
        gasAdjustment: constants.gasAdjustment,
        queryClient,
        txErrorReporter,
        onTxSucceed: () => {
          onTxSucceed?.();
          refetchQueries(NEBULA_TX_KEYS.CLUSTER_CHUCK_SWAP);
        },
        network: connectedWallet.network,
        post: connectedWallet.post,
      });
    },
    [
      connectedWallet,
      constants.gasAdjustment,
      constants.swapGasWantedPerAsset,
      onSwapSucceed,
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
