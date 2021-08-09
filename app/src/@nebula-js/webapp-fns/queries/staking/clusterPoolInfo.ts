import {
  cluster,
  cw20,
  HumanAddr,
  NativeDenom,
  staking,
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
} from '@terra-dev/mantle';
import { cw20TokenInfoQuery } from '../cw20/tokenInfo';
import { terraswapPairQuery } from '../terraswap/pair';
import { TerraswapPoolInfo, terraswapPoolQuery } from '../terraswap/pool';

interface StakingClusterPoolInfoWasmQuery {
  clusterState: WasmQuery<cluster.ClusterState, cluster.ClusterStateResponse>;
}

interface PoolInfoWasmQuery {
  poolInfo: WasmQuery<staking.PoolInfo, staking.PoolInfoResponse>;
}

export type StakingClusterPoolInfo =
  WasmQueryData<StakingClusterPoolInfoWasmQuery> &
    WasmQueryData<PoolInfoWasmQuery> & {
      terraswapPair: terraswap.factory.PairResponse;
      terraswapPool: terraswap.pair.PoolResponse<Token, UST>;
      terraswapPoolInfo: TerraswapPoolInfo<Token>;
      tokenInfo: cw20.TokenInfoResponse<Token>;
    };

export async function stakingClusterPoolInfoQuery(
  clusterAddr: HumanAddr,
  stakingAddr: HumanAddr,
  terraswapFactoryAddr: HumanAddr,
  mantleEndpoint: string,
  mantleFetch: MantleFetch = defaultMantleFetch,
  requestInit?: RequestInit,
): Promise<StakingClusterPoolInfo> {
  const { clusterState } = await mantle<StakingClusterPoolInfoWasmQuery>({
    mantleEndpoint: `${mantleEndpoint}?staking--cluster-pool-info`,
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
    },
  });

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

  const { terraswapPool, terraswapPoolInfo } = await terraswapPoolQuery(
    terraswapPair.contract_addr,
    mantleEndpoint,
    mantleFetch,
    requestInit,
  );

  const { poolInfo } = await mantle<PoolInfoWasmQuery>({
    mantleEndpoint,
    mantleFetch,
    requestInit,
    variables: {},
    wasmQuery: {
      poolInfo: {
        contractAddress: stakingAddr,
        query: {
          pool_info: {
            asset_token: clusterState.cluster_token,
          },
        },
      },
    },
  });

  return {
    poolInfo,
    terraswapPair,
    terraswapPool,
    terraswapPoolInfo,
    tokenInfo,
    clusterState,
  };
}
