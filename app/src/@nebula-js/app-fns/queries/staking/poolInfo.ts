import { cw20PoolInfoQuery, TerraswapPoolInfo } from '@libs/app-fns';
import {
  QueryClient,
  wasmFetch,
  WasmQuery,
  WasmQueryData,
} from '@libs/query-client';
import {
  cw20,
  CW20Addr,
  HumanAddr,
  staking,
  terraswap,
  Token,
  UST,
} from '@nebula-js/types';

interface StakingPoolInfoWasmQuery {
  poolInfo: WasmQuery<staking.PoolInfo, staking.PoolInfoResponse>;
}

export type StakingPoolInfo = WasmQueryData<StakingPoolInfoWasmQuery> & {
  tokenAddr: CW20Addr;
  terraswapPair: terraswap.factory.PairResponse;
  terraswapPool: terraswap.pair.PoolResponse<Token, UST>;
  terraswapPoolInfo: TerraswapPoolInfo<Token>;
  tokenInfo: cw20.TokenInfoResponse<Token>;
};

export async function stakingPoolInfoQuery(
  tokenAddr: CW20Addr,
  stakingAddr: HumanAddr,
  terraswapFactoryAddr: HumanAddr,
  queryClient: QueryClient,
): Promise<StakingPoolInfo> {
  const { terraswapPair, terraswapPool, terraswapPoolInfo, tokenInfo } =
    await cw20PoolInfoQuery(tokenAddr, terraswapFactoryAddr, queryClient);

  const { poolInfo } = await wasmFetch<StakingPoolInfoWasmQuery>({
    ...queryClient,
    id: `staking--pool-info=${tokenAddr}`,
    wasmQuery: {
      poolInfo: {
        contractAddress: stakingAddr,
        query: {
          pool_info: {
            asset_token: tokenAddr,
          },
        },
      },
    },
  });

  return {
    tokenAddr,
    poolInfo,
    terraswapPair,
    terraswapPool,
    terraswapPoolInfo,
    tokenInfo,
  };
}
