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
  mantle,
  MantleParams,
  WasmQuery,
  WasmQueryData,
} from '@terra-dev/mantle';
import { cw20TokenInfoQuery } from '../cw20/tokenInfo';
import { terraswapPairQuery } from '../terraswap/pair';
import { TerraswapPoolInfo, terraswapPoolQuery } from '../terraswap/pool';

export interface StakingClusterPoolInfoWasmQuery {
  clusterState: WasmQuery<cluster.ClusterState, cluster.ClusterStateResponse>;
}

interface PoolInfoWasmQuery {
  poolInfo: WasmQuery<staking.PoolInfo, staking.PoolInfoResponse>;
}

export type StakingClusterPoolInfo =
  WasmQueryData<StakingClusterPoolInfoWasmQuery> & {
    terraswapPair: terraswap.factory.PairResponse;
    terraswapPool: terraswap.pair.PoolResponse<Token, UST>;
    terraswapPoolInfo: TerraswapPoolInfo<Token>;
    tokenInfo: cw20.TokenInfoResponse<Token>;
    poolInfo: staking.PoolInfoResponse;
  };

export type StakingClusterPoolInfoQueryParams = Omit<
  MantleParams<StakingClusterPoolInfoWasmQuery>,
  'query' | 'variables'
> & {
  terraswapFactoryAddr: HumanAddr;
  stakingAddr: HumanAddr;
};

export async function stakingClusterPoolInfoQuery({
  mantleEndpoint,
  wasmQuery,
  stakingAddr,
  terraswapFactoryAddr,
  ...params
}: StakingClusterPoolInfoQueryParams): Promise<StakingClusterPoolInfo> {
  const { clusterState } = await mantle<StakingClusterPoolInfoWasmQuery>({
    mantleEndpoint: `${mantleEndpoint}?staking--cluster-pool-info`,
    variables: {},
    wasmQuery,
    ...params,
  });

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

  const { terraswapPool, terraswapPoolInfo } = await terraswapPoolQuery({
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

  const { poolInfo } = await mantle<PoolInfoWasmQuery>({
    mantleEndpoint,
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
    ...params,
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
