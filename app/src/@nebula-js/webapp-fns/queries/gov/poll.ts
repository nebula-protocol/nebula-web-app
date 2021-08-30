import {
  defaultMantleFetch,
  mantle,
  MantleFetch,
  WasmQuery,
  WasmQueryData,
} from '@libs/mantle';
import { cw20BalanceQuery } from '@libs/webapp-fns';
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
  mantleEndpoint: string,
  mantleFetch: MantleFetch = defaultMantleFetch,
  requestInit?: RequestInit,
): Promise<GovPoll> {
  const [{ govConfig }, { govState }, nebBalance, { poll }, blockHeight] =
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
      mantle<GovPollWasmQuery>({
        mantleEndpoint: `${mantleEndpoint}?gov--poll`,
        mantleFetch,
        requestInit,
        variables: {},
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
