import {
  QueryClient,
  wasmFetch,
  WasmQuery,
  WasmQueryData,
} from '@libs/query-client';
import { cluster_factory, HumanAddr } from '@nebula-js/types';

interface ClusterFactoryConfigWasmQuery {
  clusterFactoryConfig: WasmQuery<
    cluster_factory.Config,
    cluster_factory.ConfigResponse
  >;
}

export type ClusterFactoryConfig = WasmQueryData<ClusterFactoryConfigWasmQuery>;

export async function clusterFactoryConfigQuery(
  clusterFactoryAddr: HumanAddr,
  queryClient: QueryClient,
): Promise<ClusterFactoryConfig> {
  return wasmFetch<ClusterFactoryConfigWasmQuery>({
    ...queryClient,
    id: `cluster--factory--config=${clusterFactoryAddr}`,
    wasmQuery: {
      clusterFactoryConfig: {
        contractAddress: clusterFactoryAddr,
        query: {
          config: {},
        },
      },
    },
  });
}
