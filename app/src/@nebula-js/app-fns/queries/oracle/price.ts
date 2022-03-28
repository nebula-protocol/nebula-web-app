import {
  QueryClient,
  wasmFetch,
  WasmQuery,
  WasmQueryData,
} from '@libs/query-client';
import { oracle, HumanAddr, terraswap } from '@nebula-js/types';

interface OraclePriceWasmQuery {
  oraclePrice: WasmQuery<oracle.Price, oracle.PriceResponse>;
}

export type OraclePrice = WasmQueryData<OraclePriceWasmQuery>;

export async function oraclePriceQuery(
  oracleAddr: HumanAddr,
  baseAsset: terraswap.CW20AssetInfo | terraswap.NativeAssetInfo,
  quoteAsset: terraswap.CW20AssetInfo | terraswap.NativeAssetInfo,
  queryClient: QueryClient,
): Promise<OraclePrice> {
  return wasmFetch<OraclePriceWasmQuery>({
    ...queryClient,
    id: `oracle--price=${oracleAddr}`,
    wasmQuery: {
      oraclePrice: {
        contractAddress: oracleAddr,
        query: {
          price: {
            base_asset: baseAsset,
            quote_asset: quoteAsset,
          },
        },
      },
    },
  });
}
