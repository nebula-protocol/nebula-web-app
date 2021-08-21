import { CW20Addr, HumanAddr, staking } from '@nebula-js/types';
import {
  defaultMantleFetch,
  mantle,
  MantleFetch,
  WasmQuery,
  WasmQueryData,
} from '@packages/mantle';

interface StakingRewardInfoWasmQuery {
  rewardInfo: WasmQuery<staking.RewardInfo, staking.RewardInfoResponse>;
}

export type StakingRewardInfo = WasmQueryData<StakingRewardInfoWasmQuery>;

export async function stakingRewardInfoQuery(
  walletAddr: HumanAddr | undefined,
  stakingAddr: HumanAddr,
  clusterToken: CW20Addr | undefined,
  mantleEndpoint: string,
  mantleFetch: MantleFetch = defaultMantleFetch,
  requestInit?: RequestInit,
): Promise<StakingRewardInfo | undefined> {
  return walletAddr
    ? mantle<StakingRewardInfoWasmQuery>({
        mantleEndpoint: `${mantleEndpoint}?staking--reward-info`,
        mantleFetch,
        requestInit,
        variables: {},
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
