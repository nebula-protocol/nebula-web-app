import {
  WasmClient,
  wasmFetch,
  WasmQuery,
  WasmQueryData,
} from '@libs/query-client';
import { CT, penalty, terraswap, UST } from '@nebula-js/types';

interface SimulationWasmQuery {
  simulation: WasmQuery<
    terraswap.pair.Simulation<UST>,
    terraswap.pair.SimulationResponse<UST, CT>
  >;
}

interface RedeemWasmQuery {
  redeem: WasmQuery<penalty.Redeem, penalty.RedeemResponse>;
}

export type ClusterArbRedeem = WasmQueryData<
  SimulationWasmQuery & RedeemWasmQuery
>;

// TODO
export async function clusterArbRedeemQuery(
  lastSyncedHeight: () => Promise<number>,
  wasmClient: WasmClient,
): Promise<ClusterArbRedeem> {
  const { simulation } = await wasmFetch<SimulationWasmQuery>({
    ...wasmClient,
    id: `cluster--redeem-simulation`,
    wasmQuery: {
      simulation: {
        contractAddress: '',
        query: {} as any,
      },
    },
  });

  //wasmQuery.redeem.query.redeem.max_tokens = simulation.return_amount;

  const { redeem } = await wasmFetch<RedeemWasmQuery>({
    ...wasmClient,
    id: `cluster--redeem`,
    wasmQuery: {
      redeem: {
        contractAddress: '',
        query: {
          redeem: {} as any,
        },
      },
    },
  });

  return {
    simulation,
    redeem,
  };
}