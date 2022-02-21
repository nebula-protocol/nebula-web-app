import { QueryClient } from '@libs/query-client';
import { CW20Addr, HumanAddr } from '@nebula-js/types';
import { clusterStateListQuery } from '../clusters/stateList';
import { StakingPoolInfo, stakingPoolInfoQuery } from './poolInfo';

export type StakingPoolInfoList = (StakingPoolInfo & { isActive: boolean })[];

export async function stakingPoolInfoListQuery(
  nebTokenAddr: CW20Addr,
  stakingAddr: HumanAddr,
  clusterFactoryAddr: HumanAddr,
  terraswapFactoryAddr: HumanAddr,
  queryClient: QueryClient,
): Promise<StakingPoolInfoList> {
  const clusterStates = await clusterStateListQuery(
    clusterFactoryAddr,
    queryClient,
  );

  const tokenAddrs = [
    nebTokenAddr,
    ...clusterStates.map(({ cluster_token }) => cluster_token),
  ];

  const isActiveList = [true, ...clusterStates.map(({ active }) => active)];

  const stakingPoolInfoList = await Promise.all(
    tokenAddrs.map((tokenAddr) => {
      return stakingPoolInfoQuery(
        tokenAddr,
        stakingAddr,
        terraswapFactoryAddr,
        queryClient,
      );
    }),
  );

  return stakingPoolInfoList.map((stakingPoolInfo, idx) => ({
    ...stakingPoolInfo,
    isActive: isActiveList[idx],
  }));
}
