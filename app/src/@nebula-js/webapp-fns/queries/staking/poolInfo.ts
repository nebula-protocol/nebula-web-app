import {
  cw20,
  CW20Addr,
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
  const { terraswapPair } = await terraswapPairQuery(
    terraswapFactoryAddr,
    [
      {
        token: {
          contract_addr: tokenAddr,
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
    tokenAddr,
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
