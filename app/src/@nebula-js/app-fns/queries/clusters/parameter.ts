import {
  QueryClient,
  wasmFetch,
  WasmQuery,
  WasmQueryData,
} from '@libs/query-client';
import { cluster, HumanAddr } from '@nebula-js/types';

interface ClusterParameterWasmQuery {
  clusterConfig: WasmQuery<cluster.Config, cluster.ConfigResponse>;
  clusterTarget: WasmQuery<cluster.Target, cluster.TargetResponse>;
}

export type ClusterParameter = WasmQueryData<ClusterParameterWasmQuery>;

export async function clusterParameterQuery(
  clusterAddr: HumanAddr,
  queryClient: QueryClient,
): Promise<ClusterParameter> {
  return wasmFetch<ClusterParameterWasmQuery>({
    ...queryClient,
    id: `cluster--parameter=${clusterAddr}`,
    wasmQuery: {
      clusterConfig: {
        contractAddress: clusterAddr,
        query: {
          config: {},
        },
      },
      clusterTarget: {
        contractAddress: clusterAddr,
        query: {
          target: {},
        },
      },
    },
  });
}
