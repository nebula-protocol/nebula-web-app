import { HumanAddr, airdrop } from '@nebula-js/types';
import {
  QueryClient,
  wasmFetch,
  WasmQuery,
  WasmQueryData,
} from '@libs/query-client';

interface AirdropIsClaimedWasmQuery {
  isClaimed: WasmQuery<airdrop.IsClaimed, airdrop.IsClaimedResponse>;
}

export type AirdropIsClaimed = WasmQueryData<AirdropIsClaimedWasmQuery>;

export async function airdropIsClaimedQuery(
  airdropAddr: HumanAddr,
  walletAddr: HumanAddr,
  stage: number,
  queryClient: QueryClient,
): Promise<AirdropIsClaimed> {
  return wasmFetch<AirdropIsClaimedWasmQuery>({
    ...queryClient,
    id: `airdrop--is-claimed&address=${walletAddr}&stage=${stage}`,
    wasmQuery: {
      isClaimed: {
        contractAddress: airdropAddr,
        query: {
          is_claimed: {
            address: walletAddr,
            stage,
          },
        },
      },
    },
  });
}
