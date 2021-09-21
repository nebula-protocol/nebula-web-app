import {
  WasmClient,
  wasmFetch,
  WasmQuery,
  WasmQueryData,
} from '@libs/query-client';
import { gov, HumanAddr } from '@nebula-js/types';

export interface GovStakerWasmQuery {
  govStaker: WasmQuery<gov.Staker, gov.StakerResponse>;
}

export type GovStaker = WasmQueryData<GovStakerWasmQuery>;

export async function govStakerQuery(
  walletAddr: HumanAddr | undefined,
  govAddr: HumanAddr,
  wasmClient: WasmClient,
): Promise<GovStaker | undefined> {
  return walletAddr
    ? wasmFetch<GovStakerWasmQuery>({
        ...wasmClient,
        id: `gov--staker`,
        wasmQuery: {
          govStaker: {
            contractAddress: govAddr,
            query: {
              staker: {
                address: walletAddr,
              },
            },
          },
        },
      })
    : undefined;
}
