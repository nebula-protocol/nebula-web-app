import {
  computeMaxUstBalanceForUstTransfer,
  GasPrice,
  terraswapPairQuery,
  terraswapPoolQuery,
} from '@libs/app-fns';
import { formatExecuteMsgNumber, microfy } from '@libs/formatter';
import { QueryClient } from '@libs/query-client';
import { FormReturn } from '@libs/use-form';
import { cluster, Gas, HumanAddr, Rate, Token, u, UST } from '@nebula-js/types';
import big, { Big, BigSource } from 'big.js';
import { computeBulkSwapTxFee } from '@nebula-js/app-fns';
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
  ustBalance: u<UST>;
  taxRate: Rate;
  maxTaxUUSD: u<UST>;
  fixedFee: u<UST<BigSource>>;
  gasPrice: GasPrice;
  swapGasWantedPerAsset: Gas;
}

export interface ClusterSwapFormStates extends ClusterSwapFormInput {
  maxUstAmount: u<UST<BigSource>>;
  txFee: u<UST> | null;
  invalidUstAmount: string | null;
  invalidQuery: string | null;
}

export interface ClusterSwapFormAsyncStates {
  boughtTokens?: SwapTokenInfo[];
}

export const clusterSwapForm = ({
  queryClient,
  ustBalance,
  clusterState,
  terraswapFactoryAddr,
  taxRate,
  maxTaxUUSD,
  fixedFee,
  swapGasWantedPerAsset,
  gasPrice,
}: ClusterSwapFormDependency) => {
  const maxUstAmount = computeMaxUstBalanceForUstTransfer(
    ustBalance,
    taxRate,
    maxTaxUUSD,
    fixedFee,
  );

  return ({
    ustAmount,
  }: ClusterSwapFormInput): FormReturn<
    ClusterSwapFormStates,
    ClusterSwapFormAsyncStates
  > => {
    let invalidUstAmount: string | null;
    let invalidQuery: string | null;

    const swapTxFee = computeBulkSwapTxFee(
      gasPrice,
      swapGasWantedPerAsset,
      clusterState.target.length,
    );

    const asyncStates =
      ustAmount.length > 0
        ? Promise.all(
            clusterState.target.map(({ info }) => {
              if ('native_token' in info && info.native_token.denom === 'uusd')
                return undefined;

              return terraswapPairQuery(
                terraswapFactoryAddr,
                [
                  info,
                  {
                    native_token: {
                      denom: 'uusd',
                    },
                  },
                ],
                queryClient,
              );
            }),
          )
            .then(async (pairs) => {
              const poolInfos = await Promise.all(
                pairs.map((pair) => {
                  // ignore ust
                  if (!pair) return undefined;

                  return terraswapPoolQuery(
                    pair.terraswapPair.contract_addr,
                    queryClient,
                  );
                }),
              );

              // if there is ust in inv, set tokenPrice to 1
              const poolPrices: UST[] = poolInfos.map((poolInfo) =>
                !!poolInfo
                  ? poolInfo.terraswapPoolInfo.tokenPrice
                  : ('1' as UST),
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

              const boughtTokens = clusterState.inv.map((inv, idx) => {
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
                  tokenUstPairAddr: pairs[idx]?.terraswapPair.contract_addr,
                  beliefPrice: formatExecuteMsgNumber(poolPrices[idx]),
                };
              });

              invalidUstAmount = boughtTokens.find(
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
                txFee: swapTxFee,
                invalidUstAmount,
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
        invalidUstAmount: null,
        invalidQuery: null,
      },
      asyncStates,
    ];
  };
};
