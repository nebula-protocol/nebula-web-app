import { penalty } from '@nebula-js/types';
import {
  mantle,
  MantleParams,
  WasmQuery,
  WasmQueryData,
} from '@terra-dev/mantle';

export interface ClusterRedeemWasmQuery {
  redeem: WasmQuery<penalty.Redeem, penalty.RedeemResponse>;
}

export type ClusterRedeem = WasmQueryData<ClusterRedeemWasmQuery>;

export type ClusterRedeemQueryParams = Omit<
  MantleParams<ClusterRedeemWasmQuery>,
  'query' | 'variables'
> & {
  lastSyncedHeight: () => Promise<number>;
};

export async function clusterRedeemQuery({
  mantleEndpoint,
  lastSyncedHeight,
  wasmQuery,
  ...params
}: ClusterRedeemQueryParams): Promise<ClusterRedeem> {
  const blockHeight = await lastSyncedHeight();

  wasmQuery.redeem.query.redeem.block_height = blockHeight;

  return mantle<ClusterRedeemWasmQuery>({
    mantleEndpoint: `${mantleEndpoint}?cluster--redeem`,
    variables: {},
    wasmQuery,
    ...params,
  });
}
