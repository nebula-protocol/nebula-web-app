import { gov, HumanAddr } from '@nebula-js/types';
import {
  defaultMantleFetch,
  mantle,
  MantleFetch,
  WasmQuery,
  WasmQueryData,
} from '@libs/mantle';

interface GovVotersWasmQuery {
  voters: WasmQuery<gov.Voters, gov.VotersResponse>;
}

export type GovVoters = WasmQueryData<GovVotersWasmQuery>;

export async function govVotersQuery(
  govAddr: HumanAddr,
  votersQuery: gov.Voters['voters'],
  mantleEndpoint: string,
  mantleFetch: MantleFetch = defaultMantleFetch,
  requestInit?: RequestInit,
): Promise<GovVoters> {
  return mantle<GovVotersWasmQuery>({
    mantleEndpoint: `${mantleEndpoint}?gov--voters`,
    mantleFetch,
    requestInit,
    variables: {},
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
