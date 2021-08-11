import { gov, HumanAddr } from '@nebula-js/types';
import {
  defaultMantleFetch,
  mantle,
  MantleFetch,
  WasmQuery,
  WasmQueryData,
} from '@terra-dev/mantle';

interface GovConfigWasmQuery {
  govConfig: WasmQuery<gov.Config, gov.ConfigResponse>;
}

export type GovConfig = WasmQueryData<GovConfigWasmQuery>;

export async function govConfigQuery(
  govAddr: HumanAddr,
  mantleEndpoint: string,
  mantleFetch: MantleFetch = defaultMantleFetch,
  requestInit?: RequestInit,
): Promise<GovConfig> {
  return mantle<GovConfigWasmQuery>({
    mantleEndpoint: `${mantleEndpoint}?gov--config`,
    mantleFetch,
    requestInit,
    variables: {},
    wasmQuery: {
      govConfig: {
        contractAddress: govAddr,
        query: {
          config: {},
        },
      },
    },
  });
}
