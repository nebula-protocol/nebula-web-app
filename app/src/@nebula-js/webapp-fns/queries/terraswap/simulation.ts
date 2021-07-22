import { terraswap, Token, u } from '@nebula-js/types';
import {
  mantle,
  MantleParams,
  WasmQuery,
  WasmQueryData,
} from '@terra-money/webapp-fns';

export interface TerraswapSimulationWasmQuery {
  simulation: WasmQuery<
    terraswap.pair.Simulation<u<Token>>,
    terraswap.pair.SimulationResponse<u<Token>>
  >;
}

export type TerraswapSimulation = WasmQueryData<TerraswapSimulationWasmQuery>;

export type TerraswapSimulationQueryParams = Omit<
  MantleParams<TerraswapSimulationWasmQuery>,
  'query' | 'variables'
>;

export async function terraswapSimulationQuery({
  mantleEndpoint,
  wasmQuery,
  ...params
}: TerraswapSimulationQueryParams): Promise<TerraswapSimulation> {
  const data = await mantle<TerraswapSimulationWasmQuery>({
    mantleEndpoint: `${mantleEndpoint}?terraswap--simulation?pair=${wasmQuery.simulation.contractAddress}`,
    variables: {},
    wasmQuery,
    ...params,
  });

  console.log(
    'simulation.ts..terraswapSimulationQuery()',
    data.simulation.return_amount,
  );

  return data;
}
