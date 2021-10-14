import {
  QueryClient,
  wasmFetch,
  WasmQuery,
  WasmQueryData,
} from '@libs/query-client';
import { community, HumanAddr } from '@nebula-js/types';

interface CommunityConfigWasmQuery {
  communityConfig: WasmQuery<community.Config, community.ConfigResponse>;
}

export type CommunityConfig = WasmQueryData<CommunityConfigWasmQuery>;

export async function communityConfigQuery(
  communityAddr: HumanAddr,
  queryClient: QueryClient,
): Promise<CommunityConfig> {
  return wasmFetch<CommunityConfigWasmQuery>({
    ...queryClient,
    id: `community--config`,
    wasmQuery: {
      communityConfig: {
        contractAddress: communityAddr,
        query: {
          config: {},
        },
      },
    },
  });
}
