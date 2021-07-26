import { CT, penalty, terraswap, UST } from '@nebula-js/types';
import {
  mantle,
  MantleParams,
  WasmQuery,
  WasmQueryData,
} from '@terra-dev/mantle';

export interface ClusterArbRedeemWasmQuery {
  simulation: WasmQuery<
    terraswap.pair.Simulation<UST>,
    terraswap.pair.SimulationResponse<UST, CT>
  >;
  redeem: WasmQuery<penalty.Redeem, penalty.RedeemResponse>;
}

export type ClusterArbRedeem = WasmQueryData<ClusterArbRedeemWasmQuery>;

export type ClusterArbRedeemQueryParams = Omit<
  MantleParams<ClusterArbRedeemWasmQuery>,
  'query' | 'variables'
>;

export async function clusterArbRedeemQuery({
  mantleEndpoint,
  wasmQuery,
  ...params
}: ClusterArbRedeemQueryParams): Promise<ClusterArbRedeem> {
  type SimulationWasmQuery = Pick<ClusterArbRedeemWasmQuery, 'simulation'>;
  type RedeemWasmQuery = Pick<ClusterArbRedeemWasmQuery, 'redeem'>;

  const { simulation } = await mantle<SimulationWasmQuery>({
    mantleEndpoint: `${mantleEndpoint}?cluster--redeem-simulation`,
    variables: {},
    wasmQuery: {
      simulation: wasmQuery.simulation,
    },
    ...params,
  });

  wasmQuery.redeem.query.redeem.max_tokens = simulation.return_amount;

  const { redeem } = await mantle<RedeemWasmQuery>({
    mantleEndpoint: `${mantleEndpoint}?cluster--redeem`,
    variables: {},
    wasmQuery: {
      redeem: wasmQuery.redeem,
    },
    ...params,
  });

  return {
    simulation,
    redeem,
  };
}
