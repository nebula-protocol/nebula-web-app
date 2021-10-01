import {
  QueryClient,
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
  queryClient: QueryClient,
): Promise<clusterPenaltyParams> {
  return wasmFetch<clusterPenaltyParamsWasmQuery>({
    ...queryClient,
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
