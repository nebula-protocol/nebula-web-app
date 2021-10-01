import {
  QueryClient,
  wasmFetch,
  WasmQuery,
  WasmQueryData,
} from '@libs/query-client';
import { gov, HumanAddr } from '@nebula-js/types';

interface GovConfigWasmQuery {
  govConfig: WasmQuery<gov.Config, gov.ConfigResponse>;
}

export type GovConfig = WasmQueryData<GovConfigWasmQuery>;

export async function govConfigQuery(
  govAddr: HumanAddr,
  queryClient: QueryClient,
): Promise<GovConfig> {
  return wasmFetch<GovConfigWasmQuery>({
    ...queryClient,
    id: `gov--config`,
    wasmQuery: {
      govConfig: {
        contractAddress: govAddr,
        query: {
          config: {},
        },
      },
    },
  });
}
