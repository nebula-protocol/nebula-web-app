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
  Rate,
} from '@nebula-js/types';
import { NebulaClusterFee } from '../../types';
import big, { Big, BigSource } from 'big.js';
import {
  computeBulkSwapTxFee,
  computeClusterTxFee,
  computeMaxUstBalanceForSwap,
  swapPriceListQuery,
} from '@nebula-js/app-fns';
import { SwapTokenInfo } from '../../types';
import { divWithDefault, sum, vectorDot } from '@libs/big-math';
import { GetMintArbTxInfoResponse } from '@nebula-js/app-provider';

export interface ClusterMultiBuyFormInput {
  ustAmount: UST;
}

export interface ClusterMultiBuyFormDependency {
  connected: boolean;
  queryClient: QueryClient;
  clusterState: cluster.ClusterStateResponse;
  isArbitrage: boolean;
  terraswapFactoryAddr: HumanAddr;
  anchorProxyAddr: HumanAddr;
  oracleAddr: HumanAddr;
  aUSTAddr: CW20Addr;
  ustBalance: u<UST>;
  gasPrice: GasPrice;
  swapGasWantedPerAsset: Gas;
  clusterFee: NebulaClusterFee;
  mintArbInfoTx: GetMintArbTxInfoResponse;
}

export interface ClusterMultiBuyFormStates extends ClusterMultiBuyFormInput {
  maxUstAmount: u<UST<BigSource>>;
  txFee: u<UST> | null;
  invalidUstAmount: string | null;
  invalidQuery: string | null;
  invalidSwap: string | null;
}

export interface ClusterMultiBuyFormAsyncStates {
  boughtTokens?: SwapTokenInfo[];
  pnl?: u<UST>;
}

export const clusterMultiBuyForm = ({
  connected,
  queryClient,
  ustBalance,
  clusterState,
  terraswapFactoryAddr,
  anchorProxyAddr,
  oracleAddr,
  aUSTAddr,
  swapGasWantedPerAsset,
  gasPrice,
  clusterFee,
  isArbitrage,
  mintArbInfoTx,
}: ClusterMultiBuyFormDependency) => {
  return ({
    ustAmount,
  }: ClusterMultiBuyFormInput): FormReturn<
    ClusterMultiBuyFormStates,
    ClusterMultiBuyFormAsyncStates
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
      isArbitrage ? clusterFee.arbMint : clusterFee.default,
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
          oracleAddr,
          aUSTAddr,
          queryClient,
        )
          .then(async (priceInfos) => {
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

            const providedAmounts = boughtTokens.map(
              ({ returnAmount }) => returnAmount,
            );

            console.log(
              'multiBuy.tsx...sum',
              vectorDot(poolPrices, providedAmounts).toString(),
            );

            const _pnl = isArbitrage
              ? await mintArbInfoTx(providedAmounts, '0.01' as Rate).then(
                  ({ pnl }) => pnl,
                )
              : undefined;

            return Promise.resolve({
              boughtTokens,
              pnl: _pnl,
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
