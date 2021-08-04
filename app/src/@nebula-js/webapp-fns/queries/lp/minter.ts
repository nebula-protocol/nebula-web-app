import { lp } from '@nebula-js/types';
import {
  mantle,
  MantleParams,
  WasmQuery,
  WasmQueryData,
} from '@terra-dev/mantle';

export interface LpMinterWasmQuery {
  minter: WasmQuery<lp.Minter, lp.MinterResponse>;
}

export type LpMinter = WasmQueryData<LpMinterWasmQuery>;

export type LpMinterQueryParams = Omit<
  MantleParams<LpMinterWasmQuery>,
  'query' | 'variables'
>;

export async function lpMinterQuery({
  mantleEndpoint,
  wasmQuery,
  ...params
}: LpMinterQueryParams): Promise<LpMinter> {
  return mantle<LpMinterWasmQuery>({
    mantleEndpoint: `${mantleEndpoint}?lp--minter=${wasmQuery.minter.contractAddress}`,
    variables: {},
    wasmQuery,
    ...params,
  });
}
