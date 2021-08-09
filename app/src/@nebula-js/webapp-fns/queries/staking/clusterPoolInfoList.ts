import { HumanAddr } from '@nebula-js/types';
import { defaultMantleFetch, MantleFetch } from '@terra-dev/mantle';
import { clustersListQuery } from '../clusters/list';
import {
  StakingClusterPoolInfo,
  stakingClusterPoolInfoQuery,
} from './clusterPoolInfo';

export type StakingClusterPoolInfoList = StakingClusterPoolInfo[];

export async function stakingClusterPoolInfoListQuery(
  clusterFactoryAddr: HumanAddr,
  stakingAddr: HumanAddr,
  terraswapFactoryAddr: HumanAddr,
  mantleEndpoint: string,
  mantleFetch: MantleFetch = defaultMantleFetch,
  requestInit?: RequestInit,
): Promise<StakingClusterPoolInfoList> {
  const { clusterList } = await clustersListQuery(
    clusterFactoryAddr,
    mantleEndpoint,
    mantleFetch,
    requestInit,
  );

  return Promise.all(
    clusterList.contract_infos.map(([clusterAddr]) =>
      stakingClusterPoolInfoQuery(
        clusterAddr,
        stakingAddr,
        terraswapFactoryAddr,
        mantleEndpoint,
        mantleFetch,
        requestInit,
      ),
    ),
  );
}
