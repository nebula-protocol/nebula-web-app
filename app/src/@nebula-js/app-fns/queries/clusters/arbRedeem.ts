import {
  QueryClient,
  wasmFetch,
  WasmQuery,
  WasmQueryData,
} from '@libs/query-client';
import { CT, penalty, terraswap, Luna } from '@nebula-js/types';

interface SimulationWasmQuery {
  simulation: WasmQuery<
    terraswap.pair.Simulation<Luna>,
    terraswap.pair.SimulationResponse<Luna, CT>
  >;
}

interface RedeemWasmQuery {
  redeem: WasmQuery<
    penalty.PenaltyQueryRedeem,
    penalty.PenaltyQueryRedeemResponse
  >;
}

export type ClusterArbRedeem = WasmQueryData<
  SimulationWasmQuery & RedeemWasmQuery
>;

// TODO
export async function clusterArbRedeemQuery(
  lastSyncedHeight: () => Promise<number>,
  queryClient: QueryClient,
): Promise<ClusterArbRedeem> {
  const { simulation } = await wasmFetch<SimulationWasmQuery>({
    ...queryClient,
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
    ...queryClient,
    id: `cluster--redeem`,
    wasmQuery: {
      redeem: {
        contractAddress: '',
        query: {
          penalty_query_redeem: {} as any,
        },
      },
    },
  });

  return {
    simulation,
    redeem,
  };
}
