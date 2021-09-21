import {
  WasmClient,
  wasmFetch,
  WasmQuery,
  WasmQueryData,
} from '@libs/query-client';
import { cw20BalanceQuery } from '@libs/app-fns';
import { CW20Addr, gov, HumanAddr, NEB } from '@nebula-js/types';
import {
  ParsedPoll,
  parseGovPollResponse,
} from '../../logics/gov/parseGovPollResponse';
import { govConfigQuery } from './config';
import { govStateQuery } from './state';

interface GovPollsWasmQuery {
  polls: WasmQuery<gov.Polls, gov.PollsResponse>;
}

export type GovPolls = WasmQueryData<GovPollsWasmQuery> & {
  parsedPolls: ParsedPoll[];
};

export async function govPollsQuery(
  govAddr: HumanAddr,
  pollsQuery: gov.Polls['polls'],
  nebTokenAddr: CW20Addr,
  lastSyncedHeight: () => Promise<number>,
  wasmClient: WasmClient,
): Promise<GovPolls> {
  const [{ govConfig }, { govState }, nebBalance, { polls }, blockHeight] =
    await Promise.all([
      govConfigQuery(govAddr, wasmClient),
      govStateQuery(govAddr, wasmClient),
      cw20BalanceQuery<NEB>(govAddr, nebTokenAddr, wasmClient),
      wasmFetch<GovPollsWasmQuery>({
        ...wasmClient,
        id: `gov--polls`,
        wasmQuery: {
          polls: {
            contractAddress: govAddr,
            query: {
              polls: pollsQuery,
            },
          },
        },
      }),
      lastSyncedHeight(),
    ]);

  const parsedPolls = polls.polls.map((poll) =>
    parseGovPollResponse(
      poll,
      nebBalance!.tokenBalance,
      govState,
      govConfig,
      blockHeight,
    ),
  );

  return {
    polls,
    parsedPolls,
  };
}
