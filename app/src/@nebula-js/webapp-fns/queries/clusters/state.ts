import { cluster, HumanAddr } from '@nebula-js/types';
import {
  defaultMantleFetch,
  mantle,
  MantleFetch,
  WasmQuery,
  WasmQueryData,
} from '@packages/mantle';

interface ClusterStateWasmQuery {
  clusterState: WasmQuery<cluster.ClusterState, cluster.ClusterStateResponse>;
}

export type ClusterState = WasmQueryData<ClusterStateWasmQuery>;

export async function clusterStateQuery(
  clusterAddr: HumanAddr,
  mantleEndpoint: string,
  mantleFetch: MantleFetch = defaultMantleFetch,
  requestInit?: RequestInit,
): Promise<ClusterState> {
  return mantle<ClusterStateWasmQuery>({
    mantleEndpoint: `${mantleEndpoint}?cluster--state=${clusterAddr}`,
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
  });
}
