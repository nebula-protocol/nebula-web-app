import { cluster, CT, cw20, terraswap, Token, u, UST } from '@nebula-js/types';
import {
  mantle,
  MantleParams,
  WasmQuery,
  WasmQueryData,
} from '@terra-dev/mantle';
import { cw20TokenInfoQuery } from '../cw20/tokenInfo';

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

export type ClusterInfo = WasmQueryData<ClusterInfoWasmQuery> & {
  clusterTokenInfo: cw20.TokenInfoResponse<u<Token>>;
  assetTokenInfos: cw20.TokenInfoResponse<u<Token>>[];
};

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

  const tokenInfos = await Promise.all(
    clusterState.assets.map((asset) => {
      if ('token' in asset) {
        return cw20TokenInfoQuery({
          mantleEndpoint,
          wasmQuery: {
            tokenInfo: {
              contractAddress: asset.token.contract_addr,
              query: {
                token_info: {},
              },
            },
          },
          ...params,
        }).then(({ tokenInfo }) => tokenInfo);
      } else if ('native_token' in asset) {
        switch (asset.native_token.denom) {
          case 'uusd':
            return Promise.resolve<cw20.TokenInfoResponse<u<Token>>>({
              decimals: 6,
              name: 'UST',
              symbol: 'UST',
              total_supply: '0' as u<Token>,
            });
          case 'uluna':
            return Promise.resolve<cw20.TokenInfoResponse<u<Token>>>({
              decimals: 6,
              name: 'LUNA',
              symbol: 'LUNA',
              total_supply: '0' as u<Token>,
            });
        }
      }

      throw new Error(`Can't find token info`);
    }),
  );

  const { terraswapPair } = await mantle<TerraswapPairWasmQuery>({
    mantleEndpoint: `${mantleEndpoint}?cluster--pair&token=${clusterState.cluster_token}`,
    variables: {},
    wasmQuery: {
      terraswapPair: wasmQuery.terraswapPair,
    },
    ...params,
  });

  const { tokenInfo } = await cw20TokenInfoQuery({
    mantleEndpoint,
    wasmQuery: {
      tokenInfo: {
        contractAddress: clusterState.cluster_token,
        query: {
          token_info: {},
        },
      },
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

  return {
    clusterState,
    clusterConfig,
    terraswapPair,
    terraswapPool,
    clusterTokenInfo: tokenInfo,
    assetTokenInfos: tokenInfos,
  };
}
