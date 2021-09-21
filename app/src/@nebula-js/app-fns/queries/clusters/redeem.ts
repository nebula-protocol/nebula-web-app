import { microfy } from '@libs/formatter';
import {
  WasmClient,
  wasmFetch,
  WasmQuery,
  WasmQueryData,
} from '@libs/query-client';
import { cluster, CT, penalty, u } from '@nebula-js/types';

interface ClusterRedeemWasmQuery {
  redeem: WasmQuery<penalty.Redeem, penalty.RedeemResponse>;
}

export type ClusterRedeem = WasmQueryData<ClusterRedeemWasmQuery>;

export async function clusterRedeemQuery(
  clusterTokenAmount: CT,
  clusterState: cluster.ClusterStateResponse,
  lastSyncedHeight: () => Promise<number>,
  wasmClient: WasmClient,
): Promise<ClusterRedeem> {
  const blockHeight = await lastSyncedHeight();

  return wasmFetch<ClusterRedeemWasmQuery>({
    ...wasmClient,
    id: `cluster--redeem`,
    wasmQuery: {
      redeem: {
        contractAddress: clusterState.penalty,
        query: {
          redeem: {
            block_height: blockHeight,
            cluster_token_supply: clusterState.outstanding_balance_tokens,
            inventory: clusterState.inv,
            max_tokens: microfy(clusterTokenAmount).toFixed() as u<CT>,
            asset_prices: clusterState.prices,
            target_weights: clusterState.target.map(({ amount }) => amount),
            // TODO this field not optional
            redeem_asset_amounts: [],
          },
        },
      },
    },
  });
}
