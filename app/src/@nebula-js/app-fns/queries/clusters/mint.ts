import { microfy } from '@libs/formatter';
import {
  WasmClient,
  wasmFetch,
  WasmQuery,
  WasmQueryData,
} from '@libs/query-client';
import { cluster, penalty, Token, u } from '@nebula-js/types';

interface ClusterMintWasmQuery {
  mint: WasmQuery<penalty.Mint, penalty.MintResponse>;
}

export type ClusterMint = WasmQueryData<ClusterMintWasmQuery>;

export async function clusterMintQuery(
  amounts: Token[],
  clusterState: cluster.ClusterStateResponse,
  lastSyncedHeight: () => Promise<number>,
  wasmClient: WasmClient,
): Promise<ClusterMint> {
  const blockHeight = await lastSyncedHeight();

  return wasmFetch<ClusterMintWasmQuery>({
    ...wasmClient,
    id: `cluster--mint`,
    wasmQuery: {
      mint: {
        contractAddress: clusterState.penalty,
        query: {
          mint: {
            block_height: blockHeight,
            cluster_token_supply: clusterState.outstanding_balance_tokens,
            inventory: clusterState.inv,
            mint_asset_amounts: amounts.map(
              (amount) =>
                (amount.length > 0
                  ? microfy(amount).toFixed()
                  : '0') as u<Token>,
            ),
            asset_prices: clusterState.prices,
            target_weights: clusterState.target.map(({ amount }) => amount),
          },
        },
      },
    },
  });
}
