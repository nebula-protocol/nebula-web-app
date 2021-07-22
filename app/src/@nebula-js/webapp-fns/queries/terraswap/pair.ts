import { terraswap } from '@nebula-js/types';
import { MantleParams, WasmQuery } from '@terra-dev/mantle';
import { mantle, WasmQueryData } from '@terra-money/webapp-fns';

export interface TerraswapPairWasmQuery {
  terraswapPair: WasmQuery<
    terraswap.factory.Pair,
    terraswap.factory.PairResponse
  >;
}

export type TerraswapPair = WasmQueryData<TerraswapPairWasmQuery>;

export type TerraswapPairQueryParams = Omit<
  MantleParams<TerraswapPairWasmQuery>,
  'query' | 'variables'
>;

export async function terraswapPairQuery({
  mantleEndpoint,
  wasmQuery,
  ...params
}: TerraswapPairQueryParams): Promise<TerraswapPair> {
  const urlQuery = wasmQuery.terraswapPair.query.pair.asset_infos
    .reduce((urlQueries, asset, i) => {
      if ('token' in asset) {
        urlQueries.push(`token_${i + 1}=${asset.token.contract_addr}`);
      } else if ('native_token' in asset) {
        urlQueries.push(`native_token_${i + 1}=${asset.native_token.denom}`);
      }
      return urlQueries;
    }, [] as string[])
    .join('&');

  return mantle<TerraswapPairWasmQuery>({
    mantleEndpoint: `${mantleEndpoint}?terraswap--pair&${urlQuery}`,
    variables: {},
    wasmQuery: {
      terraswapPair: wasmQuery.terraswapPair,
    },
    ...params,
  });
}
