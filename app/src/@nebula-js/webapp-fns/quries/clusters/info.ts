import { cluster, CT, terraswap, u, UST } from '@nebula-js/types';
import {
  mantle,
  MantleParams,
  WasmQuery,
  WasmQueryData,
} from '@terra-dev/mantle';

interface ClusterStateWasmQuery {
  clusterConfig: WasmQuery<cluster.Config, cluster.ConfigResponse>;
  clusterState: WasmQuery<cluster.ClusterState, cluster.ClusterStateResponse>;
}

interface TerraswapPairWasmQuery {
  terraswapPair: WasmQuery<
    terraswap.factory.Pair,
    terraswap.factory.PairResponse
  >;
}

interface TerraswapPoolWasmQuery {
  terraswapPool: WasmQuery<
    terraswap.pair.Pool,
    terraswap.pair.PoolResponse<u<CT>, u<UST>>
  >;
}

export type ClusterInfoWasmQuery = ClusterStateWasmQuery &
  TerraswapPairWasmQuery &
  TerraswapPoolWasmQuery;

export type ClusterInfo = WasmQueryData<ClusterInfoWasmQuery>;

export type ClusterInfoQueryParams = Omit<
  MantleParams<ClusterInfoWasmQuery>,
  'query' | 'variables'
>;

export async function clusterInfoQuery({
  mantleEndpoint,
  wasmQuery,
  ...params
}: ClusterInfoQueryParams): Promise<ClusterInfo> {
  const { clusterState, clusterConfig } = await mantle<ClusterStateWasmQuery>({
    mantleEndpoint: `${mantleEndpoint}?cluster--state=${wasmQuery.clusterState.contractAddress}`,
    variables: {},
    wasmQuery: {
      clusterConfig: wasmQuery.clusterConfig,
      clusterState: wasmQuery.clusterState,
    },
    ...params,
  });

  for (const assetInfo of wasmQuery.terraswapPair.query.pair.asset_infos) {
    if ('token' in assetInfo) {
      assetInfo.token.contract_addr = clusterState.cluster_token;
    }
  }

  const { terraswapPair } = await mantle<TerraswapPairWasmQuery>({
    mantleEndpoint: `${mantleEndpoint}?cluster--pair&token=${clusterState.cluster_token}`,
    variables: {},
    wasmQuery: {
      terraswapPair: wasmQuery.terraswapPair,
    },
    ...params,
  });

  wasmQuery.terraswapPool.contractAddress = terraswapPair.contract_addr;

  const { terraswapPool } = await mantle<TerraswapPoolWasmQuery>({
    mantleEndpoint: `${mantleEndpoint}?cluster--pool=${terraswapPair.contract_addr}`,
    variables: {},
    wasmQuery: {
      terraswapPool: wasmQuery.terraswapPool,
    },
    ...params,
  });

  return { clusterState, clusterConfig, terraswapPair, terraswapPool };
}
