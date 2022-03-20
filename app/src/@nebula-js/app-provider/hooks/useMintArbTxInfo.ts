import {
  clusterMintQuery,
  computeMinReceivedAmount,
  computeUTokenWithoutFee,
} from '@nebula-js/app-fns';
import { cluster, u, CT, UST, Token, Rate, terraswap } from '@nebula-js/types';
import { useCallback } from 'react';
import { useNebulaApp } from './useNebulaApp';
import { useProtocolFee } from '../queries/cluster-factory/config';
import { terraswapSimulationQuery } from '@libs/app-fns';
import { vectorDot } from '@libs/big-math';
import big from 'big.js';

// TODO: move to types.ts
export interface MintArbTxInfo {
  totalInputValue: u<UST>;
  pnl: u<UST>;
  minReceivedUust: u<UST>;
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
          totalInputValue: '0' as u<UST>,
          pnl: '0' as u<UST>,
          minReceivedUust: '0' as u<UST>,
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
        return_amount as u<UST>,
        maxSpread,
      );

      return {
        totalInputValue: totalInputValue.toFixed(0) as u<UST>,
        pnl: big(minReceivedUust).minus(totalInputValue).toFixed() as u<UST>,
        minReceivedUust,
      };
    },
    [clusterState, terraswapPair, lastSyncedHeight, protocolFee, queryClient],
  );
}
