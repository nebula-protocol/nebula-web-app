import { gov, HumanAddr } from '@nebula-js/types';
import {
  defaultMantleFetch,
  mantle,
  MantleFetch,
  WasmQuery,
  WasmQueryData,
} from '@terra-dev/mantle';

interface GovPollsWasmQuery {
  polls: WasmQuery<gov.Polls, gov.PollsResponse>;
}

export type GovPolls = WasmQueryData<GovPollsWasmQuery>;

export async function govPollsQuery(
  govAddr: HumanAddr,
  pollsQuery: gov.Polls['polls'],
  mantleEndpoint: string,
  mantleFetch: MantleFetch = defaultMantleFetch,
  requestInit?: RequestInit,
): Promise<GovPolls> {
  return mantle<GovPollsWasmQuery>({
    mantleEndpoint: `${mantleEndpoint}?gov--polls`,
    mantleFetch,
    requestInit,
    variables: {},
    wasmQuery: {
      polls: {
        contractAddress: govAddr,
        query: {
          polls: pollsQuery,
        },
      },
    },
  });
}
