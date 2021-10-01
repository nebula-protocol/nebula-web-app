import {
  QueryClient,
  wasmFetch,
  WasmQuery,
  WasmQueryData,
} from '@libs/query-client';
import { gov, HumanAddr } from '@nebula-js/types';

interface GovVotersWasmQuery {
  voters: WasmQuery<gov.Voters, gov.VotersResponse>;
}

export type GovVoters = WasmQueryData<GovVotersWasmQuery>;

export async function govVotersQuery(
  govAddr: HumanAddr,
  votersQuery: gov.Voters['voters'],
  queryClient: QueryClient,
): Promise<GovVoters> {
  return wasmFetch<GovVotersWasmQuery>({
    ...queryClient,
    id: `gov--voters`,
    wasmQuery: {
      voters: {
        contractAddress: govAddr,
        query: {
          voters: votersQuery,
        },
      },
    },
  });
}
