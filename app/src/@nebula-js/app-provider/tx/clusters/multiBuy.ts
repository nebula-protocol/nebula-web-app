import { cw20MultiBuyTokensTx } from '@nebula-js/app-fns/tx/clusters/multiBuy';
import { useFixedFee } from '@libs/app-provider/hooks/useFixedFee';
import { Rate, u, Luna } from '@libs/types';
import { useConnectedWallet } from '@terra-money/use-wallet';
import { useCallback } from 'react';
import { useNebulaApp } from '@nebula-js/app-provider';
import { NEBULA_TX_KEYS } from '../../env';
import { useRefetchQueries } from '@libs/app-provider';
import { SwapTokenInfo } from '@nebula-js/app-fns';
import { useTwoSteps } from 'contexts/two-steps';
import { computeBulkSwapGasWanted } from '@nebula-js/app-fns';

export interface CW20MultiBuyTokenTxParams {
  buyTokens: SwapTokenInfo[];
  txFee: u<Luna>;

  onTxSucceed?: () => void;
}

export function useCW20MultiBuyTokensTx() {
  const connectedWallet = useConnectedWallet();

  const { onStep1Succeed } = useTwoSteps();

  const { queryClient, txErrorReporter, constants, contractAddress } =
    useNebulaApp();

  const fixedFee = useFixedFee();

  const refetchQueries = useRefetchQueries();

  const stream = useCallback(
    ({ buyTokens, txFee, onTxSucceed }: CW20MultiBuyTokenTxParams) => {
      if (!connectedWallet || !connectedWallet.availablePost) {
        throw new Error(`Can't post!`);
      }

      return cw20MultiBuyTokensTx({
        buyTokens,
        onSwapSucceed: onStep1Succeed,
        aUSTTokenAddr: contractAddress.cw20.aUST,
        ancMarketContractAddr: contractAddress.anchor.market,
        txFee,
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
          refetchQueries(NEBULA_TX_KEYS.CLUSTER_MULTI_BUY);
        },
        network: connectedWallet.network,
        post: connectedWallet.post,
      });
    },
    [
      connectedWallet,
      constants.gasAdjustment,
      constants.swapGasWantedPerAsset,
      contractAddress.anchor.market,
      contractAddress.cw20.aUST,
      onStep1Succeed,
      fixedFee,
      refetchQueries,
      txErrorReporter,
      queryClient,
    ],
  );

  return connectedWallet ? stream : null;
}
