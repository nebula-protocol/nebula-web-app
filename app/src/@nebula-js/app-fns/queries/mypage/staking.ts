import { StakingPoolInfo } from '@nebula-js/app-fns';
import { QueryClient } from '@libs/query-client';
import { HumanAddr, staking } from '@nebula-js/types';
import { stakingPoolInfoQuery } from '../staking/poolInfo';
import { stakingRewardInfoQuery } from '../staking/rewardInfo';

export type MypageStaking = Array<
  StakingPoolInfo & {
    rewardInfo: staking.RewardInfoResponse['reward_infos'][number];
  }
>;

export async function mypageStakingQuery(
  walletAddr: HumanAddr | undefined,
  stakingAddr: HumanAddr,
  terraswapFactoryAddr: HumanAddr,
  queryClient: QueryClient,
): Promise<MypageStaking> {
  if (!walletAddr) {
    return [];
  }

  const rewardInfoResult = await stakingRewardInfoQuery(
    walletAddr,
    stakingAddr,
    undefined,
    queryClient,
  );

  if (!rewardInfoResult) {
    return [];
  }

  const { rewardInfo } = rewardInfoResult;

  return await Promise.all(
    rewardInfo.reward_infos.map((info) => {
      return stakingPoolInfoQuery(
        info.asset_token,
        stakingAddr,
        terraswapFactoryAddr,
        queryClient,
      ).then((poolInfo) => ({
        ...poolInfo,
        rewardInfo: info,
      }));
    }),
  );
}
