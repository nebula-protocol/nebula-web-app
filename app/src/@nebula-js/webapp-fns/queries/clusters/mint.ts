import { penalty } from '@nebula-js/types';
import {
  mantle,
  MantleParams,
  WasmQuery,
  WasmQueryData,
} from '@terra-dev/mantle';

export interface ClusterMintWasmQuery {
  mint: WasmQuery<penalty.Mint, penalty.MintResponse>;
}

export type ClusterMint = WasmQueryData<ClusterMintWasmQuery>;

export type ClusterMintQueryParams = Omit<
  MantleParams<ClusterMintWasmQuery>,
  'query' | 'variables'
> & {
  lastSyncedHeight: () => Promise<number>;
};

export async function clusterMintQuery({
  mantleEndpoint,
  lastSyncedHeight,
  wasmQuery,
  ...params
}: ClusterMintQueryParams): Promise<ClusterMint> {
  const blockHeight = await lastSyncedHeight();

  wasmQuery.mint.query.mint.block_height = blockHeight;

  return mantle<ClusterMintWasmQuery>({
    mantleEndpoint: `${mantleEndpoint}?cluster--mint`,
    variables: {},
    wasmQuery,
    ...params,
  });
}
