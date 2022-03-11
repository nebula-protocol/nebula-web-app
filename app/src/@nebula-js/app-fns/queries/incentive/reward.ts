import {
  QueryClient,
  wasmFetch,
  WasmQuery,
  WasmQueryData,
} from '@libs/query-client';
import { incentives, HumanAddr } from '@nebula-js/types';

interface IncentiveRewardWasmQuery {
  incentiveReward: WasmQuery<
    incentives.ContributorPendingRewards,
    incentives.ContributorPendingRewardsResponse
  >;
}

export type IncentiveReward = WasmQueryData<IncentiveRewardWasmQuery>;

export async function IncentiveRewardQuery(
  incentiveAddr: HumanAddr,
  contributorAddr: HumanAddr | undefined,
  queryClient: QueryClient,
): Promise<IncentiveReward | undefined> {
  if (!contributorAddr) {
    return undefined;
  }

  return wasmFetch<IncentiveRewardWasmQuery>({
    ...queryClient,
    id: `incentive--reward=${incentiveAddr}&&contributor=${contributorAddr}`,
    wasmQuery: {
      incentiveReward: {
        contractAddress: incentiveAddr,
        query: {
          contributor_pending_rewards: {
            contributor_address: contributorAddr,
          },
        },
      },
    },
  });
}
