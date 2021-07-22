import { terraswap, Token, u } from '@nebula-js/types';
import {
  mantle,
  MantleParams,
  WasmQuery,
  WasmQueryData,
} from '@terra-money/webapp-fns';

export interface TerraswapReverseSimulationWasmQuery {
  simulation: WasmQuery<
    terraswap.pair.Simulation<u<Token>>,
    terraswap.pair.SimulationResponse<u<Token>>
  >;
}

export type TerraswapReverseSimulation =
  WasmQueryData<TerraswapReverseSimulationWasmQuery>;

export type TerraswapReverseSimulationQueryParams = Omit<
  MantleParams<TerraswapReverseSimulationWasmQuery>,
  'query' | 'variables'
>;

export async function terraswapReverseSimulationQuery({
  mantleEndpoint,
  wasmQuery,
  ...params
}: TerraswapReverseSimulationQueryParams): Promise<TerraswapReverseSimulation> {
  const data = await mantle<TerraswapReverseSimulationWasmQuery>({
    mantleEndpoint: `${mantleEndpoint}?terraswap--reverse-simulation?pair=${wasmQuery.simulation.contractAddress}`,
    variables: {},
    wasmQuery,
    ...params,
  });

  console.log(
    'reverseSimulation.ts..terraswapReverseSimulationQuery()',
    data.simulation.return_amount,
  );

  return data;
}
