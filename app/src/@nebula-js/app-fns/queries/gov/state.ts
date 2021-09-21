import {
  WasmClient,
  wasmFetch,
  WasmQuery,
  WasmQueryData,
} from '@libs/query-client';
import { gov, HumanAddr } from '@nebula-js/types';

interface GovStateWasmQuery {
  govState: WasmQuery<gov.State, gov.StateResponse>;
}

export type GovState = WasmQueryData<GovStateWasmQuery>;

export async function govStateQuery(
  govAddr: HumanAddr,
  wasmClient: WasmClient,
): Promise<GovState> {
  return wasmFetch<GovStateWasmQuery>({
    ...wasmClient,
    id: `gov--state`,
    wasmQuery: {
      govState: {
        contractAddress: govAddr,
        query: {
          state: {},
        },
      },
    },
  });
}
