import { CT, terraswap, u, UST } from '@nebula-js/types';
import { MantleParams, WasmQuery } from '@terra-dev/mantle';
import { mantle, WasmQueryData } from '@terra-money/webapp-fns';

interface TerraswapPoolWasmQuery {
  terraswapPool: WasmQuery<
    terraswap.pair.Pool,
    terraswap.pair.PoolResponse<u<CT>, u<UST>>
  >;
}

export type TerraswapPool = WasmQueryData<TerraswapPoolWasmQuery>;

export type TerraswapPoolQueryParams = Omit<
  MantleParams<TerraswapPoolWasmQuery>,
  'query' | 'variables'
>;

export async function terraswapPoolQuery({
  mantleEndpoint,
  wasmQuery,
  ...params
}: TerraswapPoolQueryParams): Promise<TerraswapPool> {
  return mantle<TerraswapPoolWasmQuery>({
    mantleEndpoint: `${mantleEndpoint}?terraswap--pool=${wasmQuery.terraswapPool.contractAddress}`,
    variables: {},
    wasmQuery: {
      terraswapPool: wasmQuery.terraswapPool,
    },
    ...params,
  });
}
