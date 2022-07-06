import {
  clusterMintQuery,
  computeMinReceivedAmount,
  computeUTokenWithoutFee,
} from '@nebula-js/app-fns';
import { cluster, u, CT, Luna, Token, Rate, terraswap } from '@nebula-js/types';
import { useCallback } from 'react';
import { useNebulaApp } from './useNebulaApp';
import { useProtocolFee } from '../queries/cluster-factory/config';
import { terraswapSimulationQuery } from '@libs/app-fns';
import { vectorDot } from '@libs/big-math';
import big from 'big.js';

// TODO: move to types.ts
export interface MintArbTxInfo {
  totalInputValue: u<Luna>;
  pnl: u<Luna>;
  minReceivedUust: u<Luna>;
}

export type GetMintArbTxInfoResponse = (
  amounts: u<Token>[],
  maxSpread: Rate,
) => Promise<MintArbTxInfo>;

export function useMintArbTxInfo(
  clusterState: cluster.ClusterStateResponse,
  terraswapPair: terraswap.factory.PairResponse,
): GetMintArbTxInfoResponse {
  const { lastSyncedHeight, queryClient } = useNebulaApp();

  const protocolFee = useProtocolFee();

  return useCallback(
    async (amounts: u<Token>[], maxSpread: Rate) => {
      if (amounts.length !== clusterState.prices.length) {
        return {
          totalInputValue: '0' as u<Luna>,
          pnl: '0' as u<Luna>,
          minReceivedUust: '0' as u<Luna>,
        };
      }

      const totalInputValue = vectorDot(amounts, clusterState.prices);

      const { mint } = await clusterMintQuery(
        amounts,
        clusterState,
        lastSyncedHeight,
        queryClient,
      );

      const mintedAmountWithoutFee = computeUTokenWithoutFee(
        mint.create_tokens as u<CT>,
        protocolFee,
      );

      const {
        simulation: { return_amount },
      } = await terraswapSimulationQuery(
        terraswapPair.contract_addr,
        {
          amount: mintedAmountWithoutFee,
          info: {
            token: {
              contract_addr: clusterState.cluster_token,
            },
          },
        },
        queryClient,
      );

      const minReceivedUust = computeMinReceivedAmount(
        return_amount as u<Luna>,
        maxSpread,
      );

      return {
        totalInputValue: totalInputValue.toFixed(0) as u<Luna>,
        pnl: big(minReceivedUust).minus(totalInputValue).toFixed() as u<Luna>,
        minReceivedUust,
      };
    },
    [clusterState, terraswapPair, lastSyncedHeight, protocolFee, queryClient],
  );
}
