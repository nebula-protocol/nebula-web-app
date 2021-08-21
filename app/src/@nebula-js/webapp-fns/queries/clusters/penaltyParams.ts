import { HumanAddr, penalty } from '@nebula-js/types';
import {
  defaultMantleFetch,
  mantle,
  MantleFetch,
  WasmQuery,
  WasmQueryData,
} from '@packages/mantle';

interface clusterPenaltyParamsWasmQuery {
  penaltyParams: WasmQuery<penalty.Params, penalty.ParamsResponse>;
}

export type clusterPenaltyParams = WasmQueryData<clusterPenaltyParamsWasmQuery>;

export async function clusterPenaltyParamsQuery(
  penaltyAddr: HumanAddr,
  mantleEndpoint: string,
  mantleFetch: MantleFetch = defaultMantleFetch,
  requestInit?: RequestInit,
): Promise<clusterPenaltyParams> {
  return mantle<clusterPenaltyParamsWasmQuery>({
    mantleEndpoint: `${mantleEndpoint}?cluster--penalty-params`,
    mantleFetch,
    requestInit,
    variables: {},
    wasmQuery: {
      penaltyParams: {
        contractAddress: penaltyAddr,
        query: {
          params: {},
        },
      },
    },
  });
}
