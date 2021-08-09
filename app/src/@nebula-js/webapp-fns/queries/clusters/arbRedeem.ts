import { CT, penalty, terraswap, UST } from '@nebula-js/types';
import {
  defaultMantleFetch,
  mantle,
  MantleFetch,
  WasmQuery,
  WasmQueryData,
} from '@terra-dev/mantle';

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
  mantleEndpoint: string,
  mantleFetch: MantleFetch = defaultMantleFetch,
  requestInit?: RequestInit,
): Promise<ClusterArbRedeem> {
  const { simulation } = await mantle<SimulationWasmQuery>({
    mantleEndpoint: `${mantleEndpoint}?cluster--redeem-simulation`,
    mantleFetch,
    requestInit,
    variables: {},
    wasmQuery: {
      simulation: {
        contractAddress: '',
        query: {} as any,
      },
    },
  });

  //wasmQuery.redeem.query.redeem.max_tokens = simulation.return_amount;

  const { redeem } = await mantle<RedeemWasmQuery>({
    mantleEndpoint: `${mantleEndpoint}?cluster--redeem`,
    mantleFetch,
    requestInit,
    variables: {},
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
