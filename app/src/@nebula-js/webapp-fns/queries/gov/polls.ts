import { gov } from '@nebula-js/types';
import {
  mantle,
  MantleParams,
  WasmQuery,
  WasmQueryData,
} from '@terra-dev/mantle';

export interface GovPollsWasmQuery {
  polls: WasmQuery<gov.Polls, gov.PollsResponse>;
}

export type GovPolls = WasmQueryData<GovPollsWasmQuery>;

export type GovPollsQueryParams = Omit<
  MantleParams<GovPollsWasmQuery>,
  'query' | 'variables'
>;

export async function govPollsQuery({
  mantleEndpoint,
  ...params
}: GovPollsQueryParams): Promise<GovPolls> {
  return mantle<GovPollsWasmQuery>({
    mantleEndpoint: `${mantleEndpoint}?gov--polls`,
    variables: {},
    ...params,
  });
}
