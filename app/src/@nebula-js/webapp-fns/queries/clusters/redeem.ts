import { microfy } from '@nebula-js/notation';
import { cluster, CT, penalty, u } from '@nebula-js/types';
import {
  defaultMantleFetch,
  mantle,
  MantleFetch,
  WasmQuery,
  WasmQueryData,
} from '@libs/mantle';

interface ClusterRedeemWasmQuery {
  redeem: WasmQuery<penalty.Redeem, penalty.RedeemResponse>;
}

export type ClusterRedeem = WasmQueryData<ClusterRedeemWasmQuery>;

export async function clusterRedeemQuery(
  clusterTokenAmount: CT,
  clusterState: cluster.ClusterStateResponse,
  lastSyncedHeight: () => Promise<number>,
  mantleEndpoint: string,
  mantleFetch: MantleFetch = defaultMantleFetch,
  requestInit?: RequestInit,
): Promise<ClusterRedeem> {
  const blockHeight = await lastSyncedHeight();

  return mantle<ClusterRedeemWasmQuery>({
    mantleEndpoint: `${mantleEndpoint}?cluster--redeem`,
    mantleFetch,
    requestInit,
    variables: {},
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
