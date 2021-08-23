import { cluster, HumanAddr } from '@nebula-js/types';
import {
  defaultMantleFetch,
  mantle,
  MantleFetch,
  WasmQuery,
} from '@libs/mantle';
import { clustersListQuery } from './list';

interface ClusterTokenListWasmQuery {
  clusterState: WasmQuery<cluster.ClusterState, cluster.ClusterStateResponse>;
}

export type ClusterStateList = cluster.ClusterStateResponse[];

export async function clusterStateListQuery(
  clusterFactoryAddr: HumanAddr,
  mantleEndpoint: string,
  mantleFetch: MantleFetch = defaultMantleFetch,
  requestInit?: RequestInit,
): Promise<ClusterStateList> {
  const { clusterList } = await clustersListQuery(
    clusterFactoryAddr,
    mantleEndpoint,
    mantleFetch,
    requestInit,
  );

  return Promise.all(
    clusterList.contract_infos.map(([clusterAddr]) => {
      return mantle<ClusterTokenListWasmQuery>({
        mantleEndpoint: `${mantleEndpoint}?staking--cluster-state=${clusterAddr}`,
        mantleFetch,
        requestInit,
        variables: {},
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
