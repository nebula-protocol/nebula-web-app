import {
  QueryClient,
  wasmFetch,
  WasmQuery,
  WasmQueryData,
} from '@libs/query-client';
import { gov, HumanAddr } from '@nebula-js/types';

export interface GovVotingPowerWasmQuery {
  govVotingPower: WasmQuery<gov.VotingPower, gov.VotingPowerResponse>;
}

export type GovVotingPower = WasmQueryData<GovVotingPowerWasmQuery>;

export async function govVotingPowerQuery(
  walletAddr: HumanAddr | undefined,
  govAddr: HumanAddr,
  queryClient: QueryClient,
): Promise<GovVotingPower | undefined> {
  return walletAddr
    ? wasmFetch<GovVotingPowerWasmQuery>({
        ...queryClient,
        id: `gov--votingpower`,
        wasmQuery: {
          govVotingPower: {
            contractAddress: govAddr,
            query: {
              voting_power: {
                address: walletAddr,
              },
            },
          },
        },
      })
    : undefined;
}
