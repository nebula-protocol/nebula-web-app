import { cw20, u, NEB } from '@nebula-js/types';
import {
  mantle,
  MantleParams,
  WasmQuery,
  WasmQueryData,
} from '@terra-dev/mantle';

export interface NEBTokenWasmQuery {
  nebTokenInfo: WasmQuery<cw20.TokenInfo, cw20.TokenInfoResponse<u<NEB>>>;
}

export type NEBToken = WasmQueryData<NEBTokenWasmQuery>;

export type NEBTokenQueryParams = Omit<
  MantleParams<NEBTokenWasmQuery>,
  'query' | 'variables'
>;

export async function nebTokenQuery({
  mantleEndpoint,
  ...params
}: NEBTokenQueryParams): Promise<NEBToken> {
  return mantle<NEBTokenWasmQuery>({
    mantleEndpoint: `${mantleEndpoint}?neb-token`,
    variables: {},
    ...params,
  });
}
