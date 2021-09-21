import {
  WasmClient,
  wasmFetch,
  WasmQuery,
  WasmQueryData,
} from '@libs/query-client';
import { HumanAddr, penalty } from '@nebula-js/types';

interface clusterPenaltyParamsWasmQuery {
  penaltyParams: WasmQuery<penalty.Params, penalty.ParamsResponse>;
}

export type clusterPenaltyParams = WasmQueryData<clusterPenaltyParamsWasmQuery>;

export async function clusterPenaltyParamsQuery(
  penaltyAddr: HumanAddr,
  wasmClient: WasmClient,
): Promise<clusterPenaltyParams> {
  return wasmFetch<clusterPenaltyParamsWasmQuery>({
    ...wasmClient,
    id: `cluster--penalty-params`,
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
