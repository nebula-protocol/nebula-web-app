import {
  computeMaxUstBalanceForUstTransfer,
  GasPrice,
  terraswapPairQuery,
  terraswapPoolQuery,
  terraswapSimulationQuery,
} from '@libs/app-fns';
import { formatExecuteMsgNumber, microfy } from '@libs/formatter';
import { QueryClient } from '@libs/query-client';
import { FormReturn } from '@libs/use-form';
import { cluster, HumanAddr, Rate, Token, u, UST } from '@nebula-js/types';
import big, { BigSource } from 'big.js';
import { computeClusterTxFee } from '../../../logics/clusters/computeClusterTxFee';
import { SwapTokenInfo, NebulaClusterFee } from '../../../types';
import { divWithDefault, sum } from '@libs/big-math';

export interface ClusterSwapFormInput {
  ustAmount: UST;
}

export interface ClusterSwapFormDependency {
  queryClient: QueryClient;
  clusterState: cluster.ClusterStateResponse;
  terraswapFactoryAddr: HumanAddr;
  ustBalance: u<UST>;
  taxRate: Rate;
  maxTaxUUSD: u<UST>;
  fixedFee: u<UST<BigSource>>;
  gasPrice: GasPrice;
  clusterFee: NebulaClusterFee;
  connected: boolean;
}

export interface ClusterSwapFormStates extends ClusterSwapFormInput {
  maxUstAmount: u<UST<BigSource>>;
  txFee: u<UST> | null;
  invalidUstAmount: string | null;
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
  gasPrice,
  clusterFee,
  connected,
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

    const clusterTxFee = computeClusterTxFee(
      gasPrice,
      clusterFee.default,
      clusterState.target.length,
      clusterState.target.length,
    );

    const invSum = sum(...clusterState.inv);

    const getAsyncStates = async () => {
      if (ustAmount.length > 0) {
        const pairs = await Promise.all(
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
        );

        const boughtTokens = await Promise.all(
          pairs.map(async (pair, idx) => {
            const uustAmount = microfy(ustAmount);
            const portfolioRatio = divWithDefault(
              clusterState.inv[idx],
              invSum,
              0,
            );
            const uusdPerAsset = uustAmount
              .mul(portfolioRatio)
              .toFixed(0) as u<Token>;

            if (!pair) {
              // if inventory is ust
              return {
                buyUstAmount: uusdPerAsset,
                returnAmount: uusdPerAsset,
                tokenUstPairAddr: undefined,
                beliefPrice: undefined,
              };
            } else {
              // if inventory is not ust
              const {
                terraswapPoolInfo: { tokenPrice },
              } = await terraswapPoolQuery(
                pair.terraswapPair.contract_addr,
                queryClient,
              );

              const {
                simulation: { return_amount: returnAmount },
              } = await terraswapSimulationQuery(
                pair.terraswapPair.contract_addr,
                {
                  amount: uusdPerAsset,
                  info: {
                    native_token: {
                      denom: 'uusd',
                    },
                  },
                },
                queryClient,
              );

              // TODO: hard coded minimum return amount
              if (connected && big(returnAmount).lt(10)) {
                invalidUstAmount = 'You should increase more UST to swap.';
              }

              return {
                // ust amount to buy for each inv
                buyUstAmount: uusdPerAsset,
                returnAmount,
                tokenUstPairAddr: pair.terraswapPair.contract_addr,
                beliefPrice: formatExecuteMsgNumber(tokenPrice),
              };
            }
          }),
        );

        return Promise.resolve({
          boughtTokens,
          txFee: clusterTxFee,
          invalidUstAmount,
        });
      }

      return Promise.resolve({});
    };

    return [
      {
        ustAmount,
        maxUstAmount,
        txFee: null,
        invalidUstAmount: null,
      },
      getAsyncStates(),
    ];
  };
};
