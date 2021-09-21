import { WasmClient } from '@libs/query-client';
import { HumanAddr } from '@nebula-js/types';
import { ClusterInfo, clusterInfoQuery } from './info';
import { clustersListQuery } from './list';

export type ClustersInfoList = ClusterInfo[];

export async function clustersInfoListQuery(
  clusterFactoryAddr: HumanAddr,
  terraswapFactoryAddr: HumanAddr,
  wasmClient: WasmClient,
): Promise<ClustersInfoList> {
  const { clusterList } = await clustersListQuery(
    clusterFactoryAddr,
    wasmClient,
  );

  return Promise.all(
    clusterList.contract_infos.map(([clusterAddr]) =>
      clusterInfoQuery(clusterAddr, terraswapFactoryAddr, wasmClient),
    ),
  );
}
