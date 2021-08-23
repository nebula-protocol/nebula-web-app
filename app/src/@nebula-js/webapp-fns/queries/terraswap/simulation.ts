import { HumanAddr, terraswap, Token } from '@nebula-js/types';
import { defaultMantleFetch, MantleFetch } from '@libs/mantle';
import { mantle, WasmQuery, WasmQueryData } from '@libs/webapp-fns';

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
  mantleEndpoint: string,
  mantleFetch: MantleFetch = defaultMantleFetch,
  requestInit?: RequestInit,
): Promise<TerraswapSimulation> {
  const data = await mantle<TerraswapSimulationWasmQuery>({
    mantleEndpoint: `${mantleEndpoint}?terraswap--simulation?pair=${ustPairAddr}`,
    mantleFetch,
    requestInit,
    variables: {},
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
