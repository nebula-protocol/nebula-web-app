import { defaultMantleFetch, MantleFetch } from '@libs/mantle';
import { CW20PoolInfo, cw20PoolInfoQuery } from '@libs/app-fns';
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
  mantleEndpoint: string,
  mantleFetch: MantleFetch = defaultMantleFetch,
  requestInit?: RequestInit,
): Promise<MypageStaking> {
  if (!walletAddr) {
    return [];
  }

  const rewardInfoResult = await stakingRewardInfoQuery(
    walletAddr,
    stakingAddr,
    undefined,
    mantleEndpoint,
    mantleFetch,
    requestInit,
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
        mantleEndpoint,
        mantleFetch,
        requestInit,
      ).then((poolInfo) => ({
        ...poolInfo,
        rewardInfo: info,
      }));
    }),
  );
}
