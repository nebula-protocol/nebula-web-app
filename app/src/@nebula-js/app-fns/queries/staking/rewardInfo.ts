import {
  WasmClient,
  wasmFetch,
  WasmQuery,
  WasmQueryData,
} from '@libs/query-client';
import { CW20Addr, HumanAddr, staking } from '@nebula-js/types';

interface StakingRewardInfoWasmQuery {
  rewardInfo: WasmQuery<staking.RewardInfo, staking.RewardInfoResponse>;
}

export type StakingRewardInfo = WasmQueryData<StakingRewardInfoWasmQuery>;

export async function stakingRewardInfoQuery(
  walletAddr: HumanAddr | undefined,
  stakingAddr: HumanAddr,
  clusterToken: CW20Addr | undefined,
  wasmClient: WasmClient,
): Promise<StakingRewardInfo | undefined> {
  return walletAddr
    ? wasmFetch<StakingRewardInfoWasmQuery>({
        ...wasmClient,
        id: `staking--reward-info`,
        wasmQuery: {
          rewardInfo: {
            contractAddress: stakingAddr,
            query: {
              reward_info: {
                staker_addr: walletAddr,
                asset_token: clusterToken,
              },
            },
          },
        },
      })
    : undefined;
}
