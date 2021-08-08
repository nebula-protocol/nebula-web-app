import { gov } from '@nebula-js/types';
import {
  mantle,
  MantleParams,
  WasmQuery,
  WasmQueryData,
} from '@terra-dev/mantle';

export interface GovStakerWasmQuery {
  govStaker: WasmQuery<gov.Staker, gov.StakerResponse>;
}

export type GovStaker = WasmQueryData<GovStakerWasmQuery>;

export type GovStakerQueryParams = Omit<
  MantleParams<GovStakerWasmQuery>,
  'query' | 'variables'
>;

export async function govStakerQuery({
  mantleEndpoint,
  ...params
}: GovStakerQueryParams): Promise<GovStaker> {
  return mantle<GovStakerWasmQuery>({
    mantleEndpoint: `${mantleEndpoint}?gov--staker`,
    variables: {},
    ...params,
  });
}
