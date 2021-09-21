import {
  WasmClient,
  wasmFetch,
  WasmQuery,
  WasmQueryData,
} from '@libs/query-client';
import { HumanAddr, terraswap, Token } from '@libs/types';

export interface TerraswapSimulationWasmQuery {
  simulation: WasmQuery<
    terraswap.pair.Simulation<Token>,
    terraswap.pair.SimulationResponse<Token>
  >;
}

export type TerraswapSimulation = WasmQueryData<TerraswapSimulationWasmQuery>;

export async function terraswapSimulationQuery(
  ustPairAddr: HumanAddr,
  offerAssetQuery: terraswap.pair.Simulation<Token>['simulation']['offer_asset'],
  wasmClient: WasmClient,
  //mantleEndpoint: string,
  //mantleFetch: MantleFetch = defaultMantleFetch,
  //requestInit?: RequestInit,
): Promise<TerraswapSimulation> {
  const data = await wasmFetch<TerraswapSimulationWasmQuery>({
    ...wasmClient,
    //mantleEndpoint: `${mantleEndpoint}?terraswap--simulation?pair=${ustPairAddr}`,
    //mantleFetch,
    //requestInit,
    //variables: {},
    wasmQuery: {
      simulation: {
        contractAddress: ustPairAddr,
        query: {
          simulation: {
            offer_asset: offerAssetQuery,
          },
        },
      },
    },
  });

  return data;
}
