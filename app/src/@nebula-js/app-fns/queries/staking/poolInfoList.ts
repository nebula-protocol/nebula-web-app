import { WasmClient } from '@libs/query-client';
import { CW20Addr, HumanAddr } from '@nebula-js/types';
import { clusterStateListQuery } from '../clusters/stateList';
import { StakingPoolInfo, stakingPoolInfoQuery } from './poolInfo';

export type StakingPoolInfoList = StakingPoolInfo[];

export async function stakingPoolInfoListQuery(
  nebTokenAddr: CW20Addr,
  stakingAddr: HumanAddr,
  clusterFactoryAddr: HumanAddr,
  terraswapFactoryAddr: HumanAddr,
  wasmClient: WasmClient,
): Promise<StakingPoolInfoList> {
  const clusterStates = await clusterStateListQuery(
    clusterFactoryAddr,
    wasmClient,
  );

  // TODO add NEB
  const tokenAddrs = [
    ...clusterStates.map(({ cluster_token }) => cluster_token),
  ];
  //const tokenAddrs = [nebTokenAddr, ...clusterTokenAddrs];

  return await Promise.all(
    tokenAddrs.map((tokenAddr) => {
      return stakingPoolInfoQuery(
        tokenAddr,
        stakingAddr,
        terraswapFactoryAddr,
        wasmClient,
      );
    }),
  );
}
