import {
  WasmClient,
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
  wasmClient: WasmClient,
): Promise<GovConfig> {
  return wasmFetch<GovConfigWasmQuery>({
    ...wasmClient,
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
