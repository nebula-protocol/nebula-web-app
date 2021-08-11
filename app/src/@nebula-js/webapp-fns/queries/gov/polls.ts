import { CW20Addr, gov, HumanAddr, NEB } from '@nebula-js/types';
import {
  defaultMantleFetch,
  mantle,
  MantleFetch,
  WasmQuery,
  WasmQueryData,
} from '@terra-dev/mantle';
import {
  ParsedPoll,
  parseGovPollResponse,
} from '../../logics/gov/parseGovPollResponse';
import { cw20BalanceQuery } from '../cw20/balance';
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
  mantleEndpoint: string,
  mantleFetch: MantleFetch = defaultMantleFetch,
  requestInit?: RequestInit,
): Promise<GovPolls> {
  const [{ govConfig }, { govState }, nebBalance, { polls }, blockHeight] =
    await Promise.all([
      govConfigQuery(govAddr, mantleEndpoint, mantleFetch, requestInit),
      govStateQuery(govAddr, mantleEndpoint, mantleFetch, requestInit),
      cw20BalanceQuery<NEB>(
        govAddr,
        nebTokenAddr,
        mantleEndpoint,
        mantleFetch,
        requestInit,
      ),
      mantle<GovPollsWasmQuery>({
        mantleEndpoint: `${mantleEndpoint}?gov--polls`,
        mantleFetch,
        requestInit,
        variables: {},
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
