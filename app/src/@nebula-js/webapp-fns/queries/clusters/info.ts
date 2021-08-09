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
  defaultMantleFetch,
  mantle,
  MantleFetch,
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

export async function clusterInfoQuery(
  clusterAddr: HumanAddr,
  terraswapFactoryAddr: HumanAddr,
  mantleEndpoint: string,
  mantleFetch: MantleFetch = defaultMantleFetch,
  requestInit?: RequestInit,
): Promise<ClusterInfo> {
  const { clusterState, clusterConfig } = await mantle<ClusterStateWasmQuery>({
    mantleEndpoint: `${mantleEndpoint}?cluster--state=${clusterAddr}`,
    mantleFetch,
    requestInit,
    variables: {},
    wasmQuery: {
      clusterState: {
        contractAddress: clusterAddr,
        query: {
          cluster_state: {
            cluster_contract_address: clusterAddr,
          },
        },
      },
      clusterConfig: {
        contractAddress: clusterAddr,
        query: {
          config: {},
        },
      },
    },
  });

  const tokenInfos: AssetTokenInfo[] = await Promise.all(
    clusterState.target.map(({ info }) => {
      if ('token' in info) {
        return cw20TokenInfoQuery(
          info.token.contract_addr,
          mantleEndpoint,
          mantleFetch,
          requestInit,
        ).then(
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

  const { terraswapPair } = await terraswapPairQuery(
    terraswapFactoryAddr,
    [
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
    mantleEndpoint,
    mantleFetch,
    requestInit,
  );

  const { tokenInfo } = await cw20TokenInfoQuery(
    clusterState.cluster_token,
    mantleEndpoint,
    mantleFetch,
    requestInit,
  );

  const { terraswapPool } = await terraswapPoolQuery<CT>(
    terraswapPair.contract_addr,
    mantleEndpoint,
    mantleFetch,
    requestInit,
  );

  return {
    clusterState,
    clusterConfig,
    terraswapPair,
    terraswapPool,
    clusterTokenInfo: tokenInfo,
    assetTokenInfos: tokenInfos,
  };
}
