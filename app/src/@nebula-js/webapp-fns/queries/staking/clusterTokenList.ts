import { cluster, CW20Addr, HumanAddr } from '@nebula-js/types';
import {
  defaultMantleFetch,
  mantle,
  MantleFetch,
  WasmQuery,
} from '@terra-dev/mantle';
import { clustersListQuery } from '../clusters/list';

interface StakingClusterTokenListWasmQuery {
  clusterState: WasmQuery<cluster.ClusterState, cluster.ClusterStateResponse>;
}

export type StakingClusterTokenList = CW20Addr[];

export async function stakingClusterTokenListQuery(
  clusterFactoryAddr: HumanAddr,
  mantleEndpoint: string,
  mantleFetch: MantleFetch = defaultMantleFetch,
  requestInit?: RequestInit,
): Promise<StakingClusterTokenList> {
  const { clusterList } = await clustersListQuery(
    clusterFactoryAddr,
    mantleEndpoint,
    mantleFetch,
    requestInit,
  );

  const clusterStates = await Promise.all(
    clusterList.contract_infos.map(([clusterAddr]) => {
      return mantle<StakingClusterTokenListWasmQuery>({
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
      });
    }),
  );

  return clusterStates.map(({ clusterState }) => clusterState.cluster_token);
}
