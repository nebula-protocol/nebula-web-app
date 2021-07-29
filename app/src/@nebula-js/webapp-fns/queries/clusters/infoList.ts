import { cluster_factory, HumanAddr } from '@nebula-js/types';
import { MantleParams, WasmQuery } from '@terra-dev/mantle';
import { ClusterInfo, clusterInfoQuery } from './info';
import { clustersListQuery } from './list';

export interface ClustersInfoListWasmQuery {
  clusterList: WasmQuery<
    cluster_factory.ClusterList,
    cluster_factory.ClusterListResponse
  >;
}

export type ClustersInfoList = ClusterInfo[];

export type ClustersInfoListQueryParams = Omit<
  MantleParams<ClustersInfoListWasmQuery>,
  'query' | 'variables'
> & {
  terraswapFactoryAddr: HumanAddr;
};

export async function clustersInfoListQuery({
  mantleEndpoint,
  wasmQuery,
  terraswapFactoryAddr,
  ...params
}: ClustersInfoListQueryParams): Promise<ClustersInfoList> {
  const { clusterList } = await clustersListQuery({
    mantleEndpoint,
    wasmQuery,
    ...params,
  });

  return Promise.all(
    clusterList.contract_infos.map(([clusterAddr]) =>
      clusterInfoQuery({
        mantleEndpoint,
        terraswapFactoryAddr,
        wasmQuery: {
          clusterState: {
            contractAddress: clusterAddr,
            query: {
              cluster_state: {
                cluster_contract_address: clusterAddr,
              },
            },
          },
          clusterConfig: {
            contractAddress: clusterAddr,
            query: {
              config: {},
            },
          },
        },
        ...params,
      }),
    ),
  );
}
