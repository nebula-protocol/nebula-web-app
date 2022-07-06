import {
  QueryClient,
  wasmFetch,
  WasmQuery,
  WasmQueryData,
} from '@libs/query-client';
import { HumanAddr, LP, terraswap, Token, u, Luna } from '@libs/types';
import big from 'big.js';

interface TerraswapPoolWasmQuery<T extends Token> {
  terraswapPool: WasmQuery<
    terraswap.pair.Pool,
    terraswap.pair.PoolResponse<T, Luna>
  >;
}

export type TerraswapPoolInfo<T extends Token> = {
  tokenPoolSize: u<T>;
  ustPoolSize: u<Luna>;
  tokenPrice: Luna;
  lpShare: u<LP>;
};

export type TerraswapPool<T extends Token> = WasmQueryData<
  TerraswapPoolWasmQuery<T>
> & {
  terraswapPoolInfo: TerraswapPoolInfo<T>;
};

export async function terraswapPoolQuery<T extends Token>(
  ustPairAddr: HumanAddr,
  queryClient: QueryClient,
): Promise<TerraswapPool<T>> {
  const { terraswapPool } = await wasmFetch<TerraswapPoolWasmQuery<T>>({
    ...queryClient,
    id: `terraswap--pool=${ustPairAddr}`,
    wasmQuery: {
      terraswapPool: {
        // pair contract address
        contractAddress: ustPairAddr,
        query: {
          pool: {},
        },
      },
    },
  });

  const lunaIndex = terraswapPool.assets.findIndex(
    (asset) =>
      'native_token' in asset.info && asset.info.native_token.denom === 'uluna',
  )!;
  const tokenIndex = lunaIndex === 0 ? 1 : 0;

  const tokenAsset = terraswapPool.assets[tokenIndex] as terraswap.CW20Asset<T>;
  const ustAsset = terraswapPool.assets[
    tokenIndex === 0 ? 1 : 0
  ] as terraswap.NativeAsset<Luna>;

  const tokenPoolSize = tokenAsset.amount;
  const ustPoolSize = ustAsset.amount;
  const tokenPrice = big(ustPoolSize)
    .div(+tokenPoolSize === 0 ? 1 : tokenPoolSize)
    .toFixed() as Luna;
  const lpShare = terraswapPool.total_share;

  return {
    terraswapPool,
    terraswapPoolInfo: {
      tokenPoolSize,
      ustPoolSize,
      tokenPrice,
      lpShare,
    },
  };
}
