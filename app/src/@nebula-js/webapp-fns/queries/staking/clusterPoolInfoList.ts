import { cluster_factory, HumanAddr } from '@nebula-js/types';
import { MantleParams, WasmQuery } from '@terra-dev/mantle';
import { clustersListQuery } from '../clusters/list';
import {
  StakingClusterPoolInfo,
  stakingClusterPoolInfoQuery,
} from './clusterPoolInfo';

export interface StakingClusterPoolInfoListWasmQuery {
  clusterList: WasmQuery<
    cluster_factory.ClusterList,
    cluster_factory.ClusterListResponse
  >;
}

export type StakingClusterPoolInfoList = StakingClusterPoolInfo[];

export type StakingClusterPoolInfoListQueryParams = Omit<
  MantleParams<StakingClusterPoolInfoListWasmQuery>,
  'query' | 'variables'
> & {
  terraswapFactoryAddr: HumanAddr;
  stakingAddr: HumanAddr;
};

export async function stakingClusterPoolInfoListQuery({
  mantleEndpoint,
  wasmQuery,
  terraswapFactoryAddr,
  stakingAddr,
  ...params
}: StakingClusterPoolInfoListQueryParams): Promise<StakingClusterPoolInfoList> {
  const { clusterList } = await clustersListQuery({
    mantleEndpoint,
    wasmQuery,
    ...params,
  });

  return Promise.all(
    clusterList.contract_infos.map(([clusterAddr]) =>
      stakingClusterPoolInfoQuery({
        mantleEndpoint,
        terraswapFactoryAddr,
        stakingAddr,
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
        ...params,
      }),
    ),
  );
}
