import {
  cw20,
  CW20Addr,
  HumanAddr,
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
import { cw20PoolInfoQuery } from '../cw20/poolInfo';
import { TerraswapPoolInfo } from '../terraswap/pool';

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
  mantleEndpoint: string,
  mantleFetch: MantleFetch = defaultMantleFetch,
  requestInit?: RequestInit,
): Promise<StakingPoolInfo> {
  const { terraswapPair, terraswapPool, terraswapPoolInfo, tokenInfo } =
    await cw20PoolInfoQuery(
      tokenAddr,
      terraswapFactoryAddr,
      mantleEndpoint,
      mantleFetch,
      requestInit,
    );

  const { poolInfo } = await mantle<StakingPoolInfoWasmQuery>({
    mantleEndpoint: `${mantleEndpoint}?staking--pool-info=${tokenAddr}`,
    mantleFetch,
    requestInit,
    variables: {},
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
