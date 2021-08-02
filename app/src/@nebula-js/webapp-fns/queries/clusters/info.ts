import {
  cluster,
  CT,
  cw20,
  HumanAddr,
  NativeDenom,
  terraswap,
  Token,
  u,
  UST,
} from '@nebula-js/types';
import {
  mantle,
  MantleParams,
  WasmQuery,
  WasmQueryData,
} from '@terra-dev/mantle';
import { cw20TokenInfoQuery } from '../cw20/tokenInfo';
import { terraswapPairQuery } from '../terraswap/pair';
import { terraswapPoolQuery } from '../terraswap/pool';

interface ClusterStateWasmQuery {
  clusterConfig: WasmQuery<cluster.Config, cluster.ConfigResponse>;
  clusterState: WasmQuery<cluster.ClusterState, cluster.ClusterStateResponse>;
}

export type ClusterInfoWasmQuery = ClusterStateWasmQuery;

export type AssetTokenInfo = {
  asset: terraswap.AssetInfo;
  tokenInfo: cw20.TokenInfoResponse<Token>;
};

export type ClusterInfo = WasmQueryData<ClusterInfoWasmQuery> & {
  terraswapPair: terraswap.factory.PairResponse;
  terraswapPool: terraswap.pair.PoolResponse<CT, UST>;
  clusterTokenInfo: cw20.TokenInfoResponse<Token>;
  assetTokenInfos: AssetTokenInfo[];
};

export type ClusterInfoQueryParams = Omit<
  MantleParams<ClusterInfoWasmQuery>,
  'query' | 'variables'
> & {
  terraswapFactoryAddr: HumanAddr;
};

export async function clusterInfoQuery({
  mantleEndpoint,
  wasmQuery,
  terraswapFactoryAddr,
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

  const tokenInfos: AssetTokenInfo[] = await Promise.all(
    clusterState.target.map(({ info }) => {
      if ('token' in info) {
        return cw20TokenInfoQuery({
          mantleEndpoint,
          wasmQuery: {
            tokenInfo: {
              contractAddress: info.token.contract_addr,
              query: {
                token_info: {},
              },
            },
          },
          ...params,
        }).then(
          ({ tokenInfo }) => ({ asset: info, tokenInfo } as AssetTokenInfo),
        );
      } else if ('native_token' in info) {
        switch (info.native_token.denom) {
          case 'uust':
          case 'uusd':
            return Promise.resolve({
              asset: info,
              tokenInfo: {
                decimals: 6,
                name: 'UST',
                symbol: 'UST',
                total_supply: '0' as u<Token>,
              },
            });
          case 'uluna':
            return Promise.resolve({
              asset: info,
              tokenInfo: {
                decimals: 6,
                name: 'LUNA',
                symbol: 'LUNA',
                total_supply: '0' as u<Token>,
              },
            });
        }
      }

      throw new Error(`Can't find token info`);
    }),
  );

  const { terraswapPair } = await terraswapPairQuery({
    mantleEndpoint,
    wasmQuery: {
      terraswapPair: {
        contractAddress: terraswapFactoryAddr,
        query: {
          pair: {
            asset_infos: [
              {
                token: {
                  contract_addr: clusterState.cluster_token,
                },
              },
              {
                native_token: {
                  denom: 'uusd' as NativeDenom,
                },
              },
            ],
          },
        },
      },
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

  const { terraswapPool } = await terraswapPoolQuery<CT>({
    mantleEndpoint,
    wasmQuery: {
      terraswapPool: {
        // pair contract address
        contractAddress: terraswapPair.contract_addr,
        query: {
          pool: {},
        },
      },
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
