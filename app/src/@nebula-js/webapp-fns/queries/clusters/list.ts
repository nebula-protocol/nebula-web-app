import { cluster_factory } from '@nebula-js/types';
import {
  mantle,
  MantleParams,
  WasmQuery,
  WasmQueryData,
} from '@terra-dev/mantle';

export interface ClustersListWasmQuery {
  clusterList: WasmQuery<
    cluster_factory.ClusterList,
    cluster_factory.ClusterListResponse
  >;
}

export type ClustersList = WasmQueryData<ClustersListWasmQuery>;

export type ClustersListQueryParams = Omit<
  MantleParams<ClustersListWasmQuery>,
  'query' | 'variables'
>;

export async function clustersListQuery({
  mantleEndpoint,
  ...params
}: ClustersListQueryParams): Promise<ClustersList> {
  const { clusterList } = await mantle<ClustersListWasmQuery>({
    mantleEndpoint: `${mantleEndpoint}?clusters--list`,
    variables: {},
    ...params,
  });

  const filter = new Set([
    'terra1rkgpmrqmddwtq48e5mr4vsps53vudmd4mgvfkz',
    'terra1hqve5ezyaeccc9r5v30t8gt9qaducs62jeaye4',
  ]);

  return {
    clusterList: {
      contract_addrs: clusterList.contract_addrs.filter(
        (addr) => !filter.has(addr),
      ),
    },
  };
}
