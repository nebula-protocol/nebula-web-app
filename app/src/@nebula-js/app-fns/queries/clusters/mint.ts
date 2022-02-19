import {
  QueryClient,
  wasmFetch,
  WasmQuery,
  WasmQueryData,
} from '@libs/query-client';
import { cluster, penalty, Token, u } from '@nebula-js/types';

interface ClusterMintWasmQuery {
  mint: WasmQuery<
    penalty.PenaltyQueryCreate,
    penalty.PenaltyQueryCreateResponse
  >;
}

export type ClusterMint = WasmQueryData<ClusterMintWasmQuery>;

export async function clusterMintQuery(
  amounts: u<Token>[],
  clusterState: cluster.ClusterStateResponse,
  lastSyncedHeight: () => Promise<number>,
  queryClient: QueryClient,
): Promise<ClusterMint> {
  const blockHeight = await lastSyncedHeight();

  return wasmFetch<ClusterMintWasmQuery>({
    ...queryClient,
    id: `cluster--mint`,
    wasmQuery: {
      mint: {
        contractAddress: clusterState.penalty,
        query: {
          penalty_query_create: {
            block_height: blockHeight,
            cluster_token_supply: clusterState.outstanding_balance_tokens,
            inventory: clusterState.inv,
            create_asset_amounts: amounts,
            asset_prices: clusterState.prices,
            target_weights: clusterState.target.map(({ amount }) => amount),
          },
        },
      },
    },
  });
}
