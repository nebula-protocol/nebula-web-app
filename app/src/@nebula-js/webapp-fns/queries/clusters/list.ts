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

  return { clusterList };
}
