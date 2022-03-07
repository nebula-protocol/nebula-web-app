import { microfy } from '@libs/formatter';
import {
  QueryClient,
  wasmFetch,
  WasmQuery,
  WasmQueryData,
} from '@libs/query-client';
import { cluster, CT, penalty, u, Token } from '@nebula-js/types';

interface ClusterRedeemWasmQuery {
  redeem: WasmQuery<
    penalty.PenaltyQueryRedeem,
    penalty.PenaltyQueryRedeemResponse
  >;
}

export type ClusterRedeem = WasmQueryData<ClusterRedeemWasmQuery>;

export async function clusterRedeemQuery(
  clusterTokenAmount: CT,
  redeemAssetAmount: Token[],
  clusterState: cluster.ClusterStateResponse,
  lastSyncedHeight: () => Promise<number>,
  queryClient: QueryClient,
): Promise<ClusterRedeem> {
  const blockHeight = await lastSyncedHeight();

  return wasmFetch<ClusterRedeemWasmQuery>({
    ...queryClient,
    id: `cluster--redeem`,
    wasmQuery: {
      redeem: {
        contractAddress: clusterState.penalty,
        query: {
          penalty_query_redeem: {
            block_height: blockHeight,
            cluster_token_supply: clusterState.outstanding_balance_tokens,
            inventory: clusterState.inv,
            max_tokens: microfy(clusterTokenAmount).toFixed(0) as u<CT>,
            asset_prices: clusterState.prices,
            target_weights: clusterState.target.map(({ amount }) => amount),
            redeem_asset_amounts: redeemAssetAmount.map(
              (amount) =>
                (amount.length > 0
                  ? microfy(amount).toFixed()
                  : '0') as u<Token>,
            ),
          },
        },
      },
    },
  });
}
