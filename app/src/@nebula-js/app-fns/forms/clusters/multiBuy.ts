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
  Luna,
  Rate,
} from '@nebula-js/types';
import { NebulaClusterFee } from '../../types';
import big, { Big, BigSource } from 'big.js';
import {
  computeBulkSwapTxFee,
  computeClusterTxFee,
  computeMaxLunaBalanceForSwap,
  swapPriceListQuery,
} from '@nebula-js/app-fns';
import { SwapTokenInfo } from '../../types';
import { divWithDefault, sum, vectorDot } from '@libs/big-math';
import { GetMintArbTxInfoResponse } from '@nebula-js/app-provider';

export interface ClusterMultiBuyFormInput {
  lunaAmount: Luna;
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
  lunaBalance: u<Luna>;
  gasPrice: GasPrice;
  swapGasWantedPerAsset: Gas;
  clusterFee: NebulaClusterFee;
  mintArbInfoTx: GetMintArbTxInfoResponse;
}

export interface ClusterMultiBuyFormStates extends ClusterMultiBuyFormInput {
  maxUstAmount: u<Luna<BigSource>>;
  txFee: u<Luna> | null;
  invalidUstAmount: string | null;
  invalidQuery: string | null;
  invalidSwap: string | null;
}

export interface ClusterMultiBuyFormAsyncStates {
  boughtTokens?: SwapTokenInfo[];
  pnl?: u<Luna>;
}

export const clusterMultiBuyForm = ({
  connected,
  queryClient,
  lunaBalance,
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
    lunaAmount,
  }: ClusterMultiBuyFormInput): FormReturn<
    ClusterMultiBuyFormStates,
    ClusterMultiBuyFormAsyncStates
  > => {
    let invalidQuery: string | null;
    let invalidSwap: string | null;

    const lunaAmountExists: boolean =
      !!lunaAmount && lunaAmount.length > 0 && big(lunaAmount).gt(0);

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

    const maxUstAmount = computeMaxLunaBalanceForSwap(
      lunaBalance,
      txFee,
      clusterTxFee,
    );

    if (!lunaAmountExists) {
      return [
        {
          lunaAmount,
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
      connected && microfy(lunaAmount).gt(maxUstAmount)
        ? 'Not enough Luna'
        : null;

    const asyncStates = lunaAmountExists
      ? swapPriceListQuery(
          clusterState.target,
          terraswapFactoryAddr,
          anchorProxyAddr,
          oracleAddr,
          aUSTAddr,
          queryClient,
        )
          .then(async (priceInfos) => {
            const poolPrices: Luna[] = priceInfos.map(
              ({ buyTokenPrice }) => buyTokenPrice,
            );

            const targetAmts = clusterState.target.map(({ amount }) => amount);

            // multiplierRatio = (targetSum * lunaAmount) / dot(targetAmt,prices)
            // boughtAmount = round(multiplierRatio) * targetAmt / targetSum;
            const targetSum = sum(...targetAmts);

            const priceTargetSum = vectorDot(targetAmts, poolPrices);

            const multiplierTargetRatio = divWithDefault(
              targetSum.mul(lunaAmount),
              priceTargetSum,
              0,
            ).round(10, Big.roundDown); // prevent to exceed lunaAmount

            const boughtTokens: SwapTokenInfo[] = clusterState.target.map(
              ({ info, amount }, idx) => {
                const uTokenAmount = microfy(
                  divWithDefault(
                    multiplierTargetRatio.mul(amount),
                    targetSum,
                    0,
                  ) as Token<Big>,
                ).round(0, Big.roundDown) as u<Token<Big>>;

                return {
                  buyUlunaAmount: uTokenAmount
                    .mul(poolPrices[idx])
                    .toFixed(0) as u<Luna>,
                  returnAmount: uTokenAmount.toFixed() as u<Token>,
                  tokenUstPairAddr: priceInfos[idx].tokenUstPairAddr,
                  beliefPrice: formatExecuteMsgNumber(poolPrices[idx]) as Luna,
                  info,
                };
              },
            );

            invalidSwap = boughtTokens.find(
              ({ returnAmount, buyUlunaAmount }) =>
                big(returnAmount).eq(0) || big(buyUlunaAmount).eq(0),
            )
              ? 'Insufficient Luna to swap the underlying assets.'
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
        lunaAmount,
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
