import { staking } from '@nebula-js/types';
import {
  mantle,
  MantleParams,
  WasmQuery,
  WasmQueryData,
} from '@terra-dev/mantle';

export interface StakingRewardInfoWasmQuery {
  rewardInfo: WasmQuery<staking.RewardInfo, staking.RewardInfoResponse>;
}

export type StakingRewardInfo = WasmQueryData<StakingRewardInfoWasmQuery>;

export type StakingRewardInfoQueryParams = Omit<
  MantleParams<StakingRewardInfoWasmQuery>,
  'query' | 'variables'
>;

export async function stakingRewardInfoQuery({
  mantleEndpoint,
  ...params
}: StakingRewardInfoQueryParams): Promise<StakingRewardInfo> {
  return mantle<StakingRewardInfoWasmQuery>({
    mantleEndpoint: `${mantleEndpoint}?staking--reward-info`,
    variables: {},
    ...params,
  });
}
