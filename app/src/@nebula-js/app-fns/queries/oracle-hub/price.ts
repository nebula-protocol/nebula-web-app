import {
  QueryClient,
  wasmFetch,
  WasmQuery,
  WasmQueryData,
} from '@libs/query-client';
import { oracle_hub, HumanAddr } from '@nebula-js/types';

interface OraclePriceInUSDWasmQuery {
  oraclePrice: WasmQuery<oracle_hub.Price, oracle_hub.PriceResponse>;
}

export type OraclePriceInUSD = WasmQueryData<OraclePriceInUSDWasmQuery>;

export async function oracleUSDPriceQuery(
  oracleHubAddr: HumanAddr,
  symbol: string,
  queryClient: QueryClient,
): Promise<OraclePriceInUSD> {
  return wasmFetch<OraclePriceInUSDWasmQuery>({
    ...queryClient,
    id: `oracle--usd--price=${oracleHubAddr}`,
    wasmQuery: {
      oraclePrice: {
        contractAddress: oracleHubAddr,
        query: {
          price_by_symbol: {
            symbol,
          },
        },
      },
    },
  });
}
