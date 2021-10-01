import {
  QueryClient,
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
  queryClient: QueryClient,
): Promise<GovState> {
  return wasmFetch<GovStateWasmQuery>({
    ...queryClient,
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
