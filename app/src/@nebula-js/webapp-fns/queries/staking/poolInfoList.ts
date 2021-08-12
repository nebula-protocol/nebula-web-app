import { CW20Addr, HumanAddr } from '@nebula-js/types';
import { defaultMantleFetch, MantleFetch } from '@terra-dev/mantle';
import { stakingClusterTokenListQuery } from './clusterTokenList';
import { StakingPoolInfo, stakingPoolInfoQuery } from './poolInfo';

export type StakingPoolInfoList = StakingPoolInfo[];

export async function stakingPoolInfoListQuery(
  nebTokenAddr: CW20Addr,
  stakingAddr: HumanAddr,
  clusterFactoryAddr: HumanAddr,
  terraswapFactoryAddr: HumanAddr,
  mantleEndpoint: string,
  mantleFetch: MantleFetch = defaultMantleFetch,
  requestInit?: RequestInit,
): Promise<StakingPoolInfoList> {
  const clusterTokenAddrs = await stakingClusterTokenListQuery(
    clusterFactoryAddr,
    mantleEndpoint,
    mantleFetch,
    requestInit,
  );

  // TODO add NEB
  const tokenAddrs = [...clusterTokenAddrs];
  //const tokenAddrs = [nebTokenAddr, ...clusterTokenAddrs];

  return await Promise.all(
    tokenAddrs.map((tokenAddr) => {
      return stakingPoolInfoQuery(
        tokenAddr,
        stakingAddr,
        terraswapFactoryAddr,
        mantleEndpoint,
        mantleFetch,
        requestInit,
      );
    }),
  );
}
