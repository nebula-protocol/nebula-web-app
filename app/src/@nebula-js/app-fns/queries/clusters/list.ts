import { cluster_factory, HumanAddr } from '@nebula-js/types';
import {
  defaultMantleFetch,
  mantle,
  MantleFetch,
  WasmQuery,
  WasmQueryData,
} from '@libs/mantle';

interface ClustersListWasmQuery {
  clusterList: WasmQuery<
    cluster_factory.ClusterList,
    cluster_factory.ClusterListResponse
  >;
}

export type ClustersList = WasmQueryData<ClustersListWasmQuery>;

export async function clustersListQuery(
  clusterFactoryAddr: HumanAddr,
  mantleEndpoint: string,
  mantleFetch: MantleFetch = defaultMantleFetch,
  requestInit?: RequestInit,
): Promise<ClustersList> {
  return await mantle<ClustersListWasmQuery>({
    mantleEndpoint: `${mantleEndpoint}?clusters--list`,
    mantleFetch,
    requestInit,
    variables: {},
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
