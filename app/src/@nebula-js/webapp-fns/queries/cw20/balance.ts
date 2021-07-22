import { cw20, Token, u } from '@nebula-js/types';
import {
  mantle,
  MantleParams,
  WasmQuery,
  WasmQueryData,
} from '@terra-dev/mantle';

export interface CW20BalanceWasmQuery<T extends Token> {
  tokenBalance: WasmQuery<cw20.Balance, cw20.BalanceResponse<u<T>>>;
}

export type CW20Balance<T extends Token> = WasmQueryData<
  CW20BalanceWasmQuery<T>
>;

export type CW20BalanceQueryParams<T extends Token> = Omit<
  MantleParams<CW20BalanceWasmQuery<T>>,
  'query' | 'variables'
>;

export async function cw20BalanceQuery<T extends Token>({
  mantleEndpoint,
  wasmQuery,
  ...params
}: CW20BalanceQueryParams<T>): Promise<CW20Balance<T>> {
  return mantle<CW20BalanceWasmQuery<T>>({
    mantleEndpoint: `${mantleEndpoint}?cw20--balance=${wasmQuery.tokenBalance.contractAddress}`,
    variables: {},
    wasmQuery,
    ...params,
  });
}
