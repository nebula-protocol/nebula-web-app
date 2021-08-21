import { gov, HumanAddr } from '@nebula-js/types';
import {
  defaultMantleFetch,
  mantle,
  MantleFetch,
  WasmQuery,
  WasmQueryData,
} from '@packages/mantle';

export interface GovStakerWasmQuery {
  govStaker: WasmQuery<gov.Staker, gov.StakerResponse>;
}

export type GovStaker = WasmQueryData<GovStakerWasmQuery>;

export async function govStakerQuery(
  walletAddr: HumanAddr | undefined,
  govAddr: HumanAddr,
  mantleEndpoint: string,
  mantleFetch: MantleFetch = defaultMantleFetch,
  requestInit?: RequestInit,
): Promise<GovStaker | undefined> {
  return walletAddr
    ? mantle<GovStakerWasmQuery>({
        mantleEndpoint: `${mantleEndpoint}?gov--staker`,
        mantleFetch,
        requestInit,
        variables: {},
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
