import { cw20BalanceQuery } from '@libs/app-fns';
import {
  WasmClient,
  wasmFetch,
  WasmQuery,
  WasmQueryData,
} from '@libs/query-client';
import { CW20Addr, gov, HumanAddr, NEB } from '@nebula-js/types';
import {
  ParsedPoll,
  parseGovPollResponse,
} from '../../logics/gov/parseGovPollResponse';
import { govConfigQuery } from './config';
import { govStateQuery } from './state';

interface GovPollWasmQuery {
  poll: WasmQuery<gov.Poll, gov.PollResponse>;
}

export type GovPoll = WasmQueryData<GovPollWasmQuery> & {
  parsedPoll: ParsedPoll;
};

export async function govPollQuery(
  govAddr: HumanAddr,
  pollId: number,
  nebTokenAddr: CW20Addr,
  lastSyncedHeight: () => Promise<number>,
  wasmClient: WasmClient,
): Promise<GovPoll> {
  const [{ govConfig }, { govState }, nebBalance, { poll }, blockHeight] =
    await Promise.all([
      govConfigQuery(govAddr, wasmClient),
      govStateQuery(govAddr, wasmClient),
      cw20BalanceQuery<NEB>(govAddr, nebTokenAddr, wasmClient),
      wasmFetch<GovPollWasmQuery>({
        ...wasmClient,
        id: `gov--poll`,
        wasmQuery: {
          poll: {
            contractAddress: govAddr,
            query: {
              poll: {
                poll_id: pollId,
              },
            },
          },
        },
      }),
      lastSyncedHeight(),
    ]);

  const parsedPoll = parseGovPollResponse(
    poll,
    nebBalance!.tokenBalance,
    govState,
    govConfig,
    blockHeight,
  );

  return {
    poll,
    parsedPoll,
  };
}
