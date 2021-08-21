import { HumanAddr } from '@nebula-js/types';
import { defaultMantleFetch, MantleFetch } from '@packages/mantle';
import { ClusterInfo, clusterInfoQuery } from './info';
import { clustersListQuery } from './list';

export type ClustersInfoList = ClusterInfo[];

export async function clustersInfoListQuery(
  clusterFactoryAddr: HumanAddr,
  terraswapFactoryAddr: HumanAddr,
  mantleEndpoint: string,
  mantleFetch: MantleFetch = defaultMantleFetch,
  requestInit?: RequestInit,
): Promise<ClustersInfoList> {
  const { clusterList } = await clustersListQuery(
    clusterFactoryAddr,
    mantleEndpoint,
    mantleFetch,
    requestInit,
  );

  return Promise.all(
    clusterList.contract_infos.map(([clusterAddr]) =>
      clusterInfoQuery(
        clusterAddr,
        terraswapFactoryAddr,
        mantleEndpoint,
        mantleFetch,
        requestInit,
      ),
    ),
  );
}
