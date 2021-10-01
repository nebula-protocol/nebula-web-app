import {
  QueryClient,
  wasmFetch,
  WasmQuery,
  WasmQueryData,
} from '@libs/query-client';
import { cluster, HumanAddr } from '@nebula-js/types';

interface ClusterStateWasmQuery {
  clusterState: WasmQuery<cluster.ClusterState, cluster.ClusterStateResponse>;
}

export type ClusterState = WasmQueryData<ClusterStateWasmQuery>;

export async function clusterStateQuery(
  clusterAddr: HumanAddr,
  queryClient: QueryClient,
): Promise<ClusterState> {
  return wasmFetch<ClusterStateWasmQuery>({
    ...queryClient,
    id: `cluster--state=${clusterAddr}`,
    wasmQuery: {
      clusterState: {
        contractAddress: clusterAddr,
        query: {
          cluster_state: {
            cluster_contract_address: clusterAddr,
          },
        },
      },
    },
  });
}
