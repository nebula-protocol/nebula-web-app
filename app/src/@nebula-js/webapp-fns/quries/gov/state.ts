import { gov } from '@nebula-js/types';
import {
  mantle,
  MantleParams,
  WasmQuery,
  WasmQueryData,
} from '@terra-dev/mantle';

export interface GovStateWasmQuery {
  govState: WasmQuery<gov.State, gov.StateResponse>;
}

export type GovState = WasmQueryData<GovStateWasmQuery>;

export type GovStateQueryParams = Omit<
  MantleParams<GovStateWasmQuery>,
  'query' | 'variables'
>;

export async function govStateQuery({
  mantleEndpoint,
  ...params
}: GovStateQueryParams): Promise<GovState> {
  return mantle<GovStateWasmQuery>({
    mantleEndpoint: `${mantleEndpoint}?gov--state`,
    variables: {},
    ...params,
  });
}
