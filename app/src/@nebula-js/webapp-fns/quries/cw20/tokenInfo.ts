import { cw20, Token, u } from '@nebula-js/types';
import {
  mantle,
  MantleParams,
  WasmQuery,
  WasmQueryData,
} from '@terra-dev/mantle';
import { cw20TokenInfoCache } from '../../caches/cw20TokenInfoCache';

export interface CW20TokenInfoWasmQuery {
  tokenInfo: WasmQuery<cw20.TokenInfo, cw20.TokenInfoResponse<u<Token>>>;
}

export type CW20TokenInfo = WasmQueryData<CW20TokenInfoWasmQuery>;

export type CW20TokenInfoQueryParams = Omit<
  MantleParams<CW20TokenInfoWasmQuery>,
  'query' | 'variables'
>;

export async function cw20TokenInfoQuery({
  mantleEndpoint,
  wasmQuery,
  ...params
}: CW20TokenInfoQueryParams): Promise<CW20TokenInfo> {
  if (cw20TokenInfoCache.has(wasmQuery.tokenInfo.contractAddress)) {
    return {
      tokenInfo: cw20TokenInfoCache.get(wasmQuery.tokenInfo.contractAddress)!,
    };
  }

  const { tokenInfo } = await mantle<CW20TokenInfoWasmQuery>({
    mantleEndpoint: `${mantleEndpoint}?cw20--token-info=${wasmQuery.tokenInfo.contractAddress}`,
    variables: {},
    wasmQuery,
    ...params,
  });

  cw20TokenInfoCache.set(wasmQuery.tokenInfo.contractAddress, tokenInfo);

  return { tokenInfo };
}
