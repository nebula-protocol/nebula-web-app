import { cw20, Token } from '@nebula-js/types';
import {
  mantle,
  MantleParams,
  WasmQuery,
  WasmQueryData,
} from '@terra-dev/mantle';
import { cw20TokenInfoCache } from '../../caches/cw20TokenInfoCache';

export interface CW20TokenInfoWasmQuery<T extends Token> {
  tokenInfo: WasmQuery<cw20.TokenInfo, cw20.TokenInfoResponse<T>>;
}

export type CW20TokenInfo<T extends Token> = WasmQueryData<
  CW20TokenInfoWasmQuery<T>
>;

export type CW20TokenInfoQueryParams<T extends Token> = Omit<
  MantleParams<CW20TokenInfoWasmQuery<T>>,
  'query' | 'variables'
>;

export async function cw20TokenInfoQuery<T extends Token>({
  mantleEndpoint,
  wasmQuery,
  ...params
}: CW20TokenInfoQueryParams<T>): Promise<CW20TokenInfo<T>> {
  if (cw20TokenInfoCache.has(wasmQuery.tokenInfo.contractAddress)) {
    return {
      tokenInfo: cw20TokenInfoCache.get(
        wasmQuery.tokenInfo.contractAddress,
      )! as cw20.TokenInfoResponse<T>,
    };
  }

  const { tokenInfo } = await mantle<CW20TokenInfoWasmQuery<T>>({
    mantleEndpoint: `${mantleEndpoint}?cw20--token-info=${wasmQuery.tokenInfo.contractAddress}`,
    variables: {},
    wasmQuery,
    ...params,
  });

  cw20TokenInfoCache.set(wasmQuery.tokenInfo.contractAddress, tokenInfo);

  return { tokenInfo };
}
