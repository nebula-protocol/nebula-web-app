import { CW20PoolInfo, cw20PoolInfoQuery } from '@libs/app-fns';
import { QueryClient } from '@libs/query-client';
import { HumanAddr, staking, Token } from '@nebula-js/types';
import { stakingRewardInfoQuery } from '../staking/rewardInfo';

export type MypageStaking = Array<
  CW20PoolInfo<Token> & {
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
      return cw20PoolInfoQuery(
        info.asset_token,
        terraswapFactoryAddr,
        queryClient,
      ).then((poolInfo) => ({
        ...poolInfo,
        rewardInfo: info,
      }));
    }),
  );
}
