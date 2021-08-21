import { gov, HumanAddr } from '@nebula-js/types';
import {
  defaultMantleFetch,
  mantle,
  MantleFetch,
  WasmQuery,
  WasmQueryData,
} from '@packages/mantle';

interface GovStateWasmQuery {
  govState: WasmQuery<gov.State, gov.StateResponse>;
}

export type GovState = WasmQueryData<GovStateWasmQuery>;

export async function govStateQuery(
  govAddr: HumanAddr,
  mantleEndpoint: string,
  mantleFetch: MantleFetch = defaultMantleFetch,
  requestInit?: RequestInit,
): Promise<GovState> {
  return mantle<GovStateWasmQuery>({
    mantleEndpoint: `${mantleEndpoint}?gov--state`,
    mantleFetch,
    requestInit,
    variables: {},
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
