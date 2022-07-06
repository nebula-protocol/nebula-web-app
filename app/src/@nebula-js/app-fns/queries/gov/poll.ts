import { cw20BalanceQuery } from '@libs/app-fns';
import {
  QueryClient,
  wasmFetch,
  WasmQuery,
  WasmQueryData,
} from '@libs/query-client';
import { NebulaContractAddress } from '@nebula-js/app-provider';
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
  contractAddress: NebulaContractAddress,
  lastSyncedHeight: () => Promise<number>,
  queryClient: QueryClient,
): Promise<GovPoll> {
  const [{ govConfig }, { govState }, nebBalance, { poll }, blockHeight] =
    await Promise.all([
      govConfigQuery(govAddr, queryClient),
      govStateQuery(govAddr, queryClient),
      cw20BalanceQuery<NEB>(govAddr, nebTokenAddr, queryClient),
      wasmFetch<GovPollWasmQuery>({
        ...queryClient,
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

  console.log(poll, blockHeight);

  const parsedPoll = parseGovPollResponse(
    poll,
    nebBalance!.tokenBalance,
    govState,
    govConfig,
    contractAddress,
    blockHeight,
  );

  return {
    poll,
    parsedPoll,
  };
}
