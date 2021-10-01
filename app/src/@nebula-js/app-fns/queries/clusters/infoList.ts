import { QueryClient } from '@libs/query-client';
import { HumanAddr } from '@nebula-js/types';
import { ClusterInfo, clusterInfoQuery } from './info';
import { clustersListQuery } from './list';

export type ClustersInfoList = ClusterInfo[];

export async function clustersInfoListQuery(
  clusterFactoryAddr: HumanAddr,
  terraswapFactoryAddr: HumanAddr,
  queryClient: QueryClient,
): Promise<ClustersInfoList> {
  const { clusterList } = await clustersListQuery(
    clusterFactoryAddr,
    queryClient,
  );

  return Promise.all(
    clusterList.contract_infos.map(([clusterAddr]) =>
      clusterInfoQuery(clusterAddr, terraswapFactoryAddr, queryClient),
    ),
  );
}
