import {
  QueryClient,
  wasmFetch,
  WasmQuery,
  WasmQueryData,
} from '@libs/query-client';
import { cluster_factory, HumanAddr } from '@nebula-js/types';

interface ClustersListWasmQuery {
  clusterList: WasmQuery<
    cluster_factory.ClusterList,
    cluster_factory.ClusterListResponse
  >;
}

export type ClustersList = WasmQueryData<ClustersListWasmQuery>;

export async function clustersListQuery(
  clusterFactoryAddr: HumanAddr,
  queryClient: QueryClient,
): Promise<ClustersList> {
  return await wasmFetch<ClustersListWasmQuery>({
    ...queryClient,
    id: `clusters--list`,
    wasmQuery: {
      clusterList: {
        contractAddress: clusterFactoryAddr,
        query: {
          cluster_list: {},
        },
      },
    },
  });
}
