import { LP, terraswap, Token, u, UST } from '@nebula-js/types';
import { MantleParams, WasmQuery } from '@terra-dev/mantle';
import { mantle, WasmQueryData } from '@terra-money/webapp-fns';
import big from 'big.js';

interface TerraswapPoolWasmQuery<T extends Token> {
  terraswapPool: WasmQuery<
    terraswap.pair.Pool,
    terraswap.pair.PoolResponse<T, UST>
  >;
}

export type TerraswapPoolInfo<T extends Token> = {
  tokenPoolSize: u<T>;
  ustPoolSize: u<UST>;
  tokenPrice: UST;
  lpShare: u<LP>;
};

export type TerraswapPool<T extends Token> = WasmQueryData<
  TerraswapPoolWasmQuery<T>
> & {
  terraswapPoolInfo: TerraswapPoolInfo<T>;
};

export type TerraswapPoolQueryParams<T extends Token> = Omit<
  MantleParams<TerraswapPoolWasmQuery<T>>,
  'query' | 'variables'
>;

export async function terraswapPoolQuery<T extends Token>({
  mantleEndpoint,
  wasmQuery,
  ...params
}: TerraswapPoolQueryParams<T>): Promise<TerraswapPool<T>> {
  const { terraswapPool } = await mantle<TerraswapPoolWasmQuery<T>>({
    mantleEndpoint: `${mantleEndpoint}?terraswap--pool=${wasmQuery.terraswapPool.contractAddress}`,
    variables: {},
    wasmQuery: {
      terraswapPool: wasmQuery.terraswapPool,
    },
    ...params,
  });

  const tokenIndex = terraswapPool.assets.findIndex(
    (asset) => 'token' in asset.info,
  )!;

  const tokenAsset = terraswapPool.assets[tokenIndex] as terraswap.CW20Asset<T>;
  const ustAsset = terraswapPool.assets[
    tokenIndex === 0 ? 1 : 0
  ] as terraswap.NativeAsset<UST>;

  const tokenPoolSize = tokenAsset.amount;
  const ustPoolSize = ustAsset.amount;
  const tokenPrice = big(ustPoolSize)
    .div(+tokenPoolSize === 0 ? 1 : tokenPoolSize)
    .toFixed() as UST;
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