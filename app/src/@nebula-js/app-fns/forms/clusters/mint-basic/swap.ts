import { GasPrice } from '@libs/app-fns';
import { formatExecuteMsgNumber, microfy } from '@libs/formatter';
import { QueryClient } from '@libs/query-client';
import { FormReturn } from '@libs/use-form';
import {
  cluster,
  CW20Addr,
  Gas,
  HumanAddr,
  Token,
  u,
  UST,
} from '@nebula-js/types';
import { NebulaClusterFee } from '../../../types';
import big, { Big, BigSource } from 'big.js';
import {
  computeBulkSwapTxFee,
  computeClusterTxFee,
  computeMaxUstBalanceForSwap,
  swapPriceListQuery,
} from '@nebula-js/app-fns';
import { SwapTokenInfo } from '../../../types';
import { divWithDefault, sum, vectorDot } from '@libs/big-math';

export interface ClusterSwapFormInput {
  ustAmount: UST;
}

export interface ClusterSwapFormDependency {
  connected: boolean;
  queryClient: QueryClient;
  clusterState: cluster.ClusterStateResponse;
  terraswapFactoryAddr: HumanAddr;
  anchorProxyAddr: HumanAddr;
  aUSTAddr: CW20Addr;
  ustBalance: u<UST>;
  fixedFee: u<UST<BigSource>>;
  gasPrice: GasPrice;
  swapGasWantedPerAsset: Gas;
  clusterFee: NebulaClusterFee;
}

export interface ClusterSwapFormStates extends ClusterSwapFormInput {
  maxUstAmount: u<UST<BigSource>>;
  txFee: u<UST> | null;
  invalidUstAmount: string | null;
  invalidQuery: string | null;
  invalidSwap: string | null;
}

export interface ClusterSwapFormAsyncStates {
  boughtTokens?: SwapTokenInfo[];
}

export const clusterSwapForm = ({
  connected,
  queryClient,
  ustBalance,
  clusterState,
  terraswapFactoryAddr,
  anchorProxyAddr,
  aUSTAddr,
  swapGasWantedPerAsset,
  gasPrice,
  clusterFee,
}: ClusterSwapFormDependency) => {
  return ({
    ustAmount,
  }: ClusterSwapFormInput): FormReturn<
    ClusterSwapFormStates,
    ClusterSwapFormAsyncStates
  > => {
    let invalidQuery: string | null;
    let invalidSwap: string | null;

    const ustAmountExists: boolean =
      !!ustAmount && ustAmount.length > 0 && big(ustAmount).gt(0);

    const txFee = computeBulkSwapTxFee(
      gasPrice,
      swapGasWantedPerAsset,
      clusterState.target.length,
    );

    const clusterTxFee = computeClusterTxFee(
      gasPrice,
      clusterFee.default,
      clusterState.target.length,
      clusterState.target.length,
    );

    const maxUstAmount = computeMaxUstBalanceForSwap(
      ustBalance,
      txFee,
      clusterTxFee,
    );

    if (!ustAmountExists) {
      return [
        {
          ustAmount,
          maxUstAmount,
          txFee: null,
          invalidUstAmount: null,
          invalidQuery: null,
          invalidSwap: null,
        },
        undefined,
      ];
    }

    const invalidUstAmount =
      connected && microfy(ustAmount).gt(maxUstAmount)
        ? 'Not enough UST'
        : null;

    const asyncStates = ustAmountExists
      ? swapPriceListQuery(
          clusterState.target,
          terraswapFactoryAddr,
          anchorProxyAddr,
          aUSTAddr,
          queryClient,
        )
          .then((priceInfos) => {
            const poolPrices: UST[] = priceInfos.map(
              ({ buyTokenPrice }) => buyTokenPrice,
            );

            // multiplierRatio = (invSum * ustAmount) / dot(inv,prices)
            // boughtAmount = round(multiplierRatio) * inv / invSum;
            const invSum = sum(...clusterState.inv);

            const priceInvSum = vectorDot(clusterState.inv, poolPrices);

            const multiplierInvRatio = divWithDefault(
              invSum.mul(ustAmount),
              priceInvSum,
              0,
            ).round(10, Big.roundDown); // prevent to exceed ustAmount

            const boughtTokens: SwapTokenInfo[] = clusterState.inv.map(
              (inv, idx) => {
                const uTokenAmount = microfy(
                  divWithDefault(
                    multiplierInvRatio.mul(inv),
                    invSum,
                    0,
                  ) as Token<Big>,
                ).round(0, Big.roundDown) as u<Token<Big>>;

                return {
                  buyUustAmount: uTokenAmount
                    .mul(poolPrices[idx])
                    .toFixed(0) as u<UST>,
                  returnAmount: uTokenAmount.toFixed() as u<Token>,
                  tokenUstPairAddr: priceInfos[idx].tokenUstPairAddr,
                  beliefPrice: formatExecuteMsgNumber(poolPrices[idx]) as UST,
                  info: priceInfos[idx].info,
                };
              },
            );

            invalidSwap = boughtTokens.find(
              ({ returnAmount, buyUustAmount }) =>
                big(returnAmount).eq(0) || big(buyUustAmount).eq(0),
            )
              ? 'Insufficient UST to swap the underlying assets.'
              : null;

            console.log(
              'swap.tsx...sum',
              vectorDot(
                poolPrices,
                boughtTokens.map(({ returnAmount }) => returnAmount),
              ).toString(),
            );

            return Promise.resolve({
              boughtTokens,
              txFee,
              invalidSwap,
              invalidQuery,
            });
          })
          .catch((err) => {
            invalidQuery = err.message;

            return Promise.resolve({ invalidQuery });
          })
      : Promise.resolve({});

    return [
      {
        ustAmount,
        maxUstAmount,
        txFee: null,
        invalidUstAmount,
        invalidQuery: null,
        invalidSwap: null,
      },
      asyncStates,
    ];
  };
};
