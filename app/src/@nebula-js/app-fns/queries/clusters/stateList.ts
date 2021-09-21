import { WasmClient, wasmFetch, WasmQuery } from '@libs/query-client';
import { cluster, HumanAddr } from '@nebula-js/types';
import { clustersListQuery } from './list';

interface ClusterTokenListWasmQuery {
  clusterState: WasmQuery<cluster.ClusterState, cluster.ClusterStateResponse>;
}

export type ClusterStateList = cluster.ClusterStateResponse[];

export async function clusterStateListQuery(
  clusterFactoryAddr: HumanAddr,
  wasmClient: WasmClient,
): Promise<ClusterStateList> {
  const { clusterList } = await clustersListQuery(
    clusterFactoryAddr,
    wasmClient,
  );

  return Promise.all(
    clusterList.contract_infos.map(([clusterAddr]) => {
      return wasmFetch<ClusterTokenListWasmQuery>({
        ...wasmClient,
        id: `staking--cluster-state=${clusterAddr}`,
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
      }).then(({ clusterState }) => clusterState);
    }),
  );
}
