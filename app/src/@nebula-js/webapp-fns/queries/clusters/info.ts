import {
  cluster,
  CT,
  cw20,
  HumanAddr,
  terraswap,
  Token,
  UST,
} from '@nebula-js/types';
import {
  defaultMantleFetch,
  mantle,
  MantleFetch,
  WasmQuery,
  WasmQueryData,
} from '@libs/mantle';
import { nativeTokenInfoQuery } from '../cw20/nativeTokenInfo';
import { cw20PoolInfoQuery } from '../cw20/poolInfo';
import { cw20TokenInfoQuery } from '../cw20/tokenInfo';
import { TerraswapPoolInfo } from '../terraswap/pool';

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
  terraswapPoolInfo: TerraswapPoolInfo<CT>;
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
        return Promise.resolve(
          nativeTokenInfoQuery(info.native_token.denom),
        ).then(
          (tokenInfo) =>
            ({
              asset: info,
              tokenInfo: tokenInfo!,
            } as AssetTokenInfo),
        );
      }

      throw new Error(`Can't find token info`);
    }),
  );

  const { terraswapPair, terraswapPool, terraswapPoolInfo, tokenInfo } =
    await cw20PoolInfoQuery<CT>(
      clusterState.cluster_token,
      terraswapFactoryAddr,
      mantleEndpoint,
      mantleFetch,
      requestInit,
    );

  return {
    clusterState,
    clusterConfig,
    terraswapPair,
    terraswapPool,
    terraswapPoolInfo,
    clusterTokenInfo: tokenInfo,
    assetTokenInfos: tokenInfos,
  };
}
