import {
  QueryClient,
  wasmFetch,
  WasmQuery,
  WasmQueryData,
} from '@libs/query-client';
import { anchor, HumanAddr } from '@nebula-js/types';

interface AnchorBaseWasmQuery {
  anchorBase: WasmQuery<anchor.Base, anchor.BaseResponse>;
}

export type anchorBase = WasmQueryData<AnchorBaseWasmQuery>;

export async function anchorAUSTRateQuery(
  anchorProxyAddr: HumanAddr,
  queryClient: QueryClient,
): Promise<anchorBase> {
  return wasmFetch<AnchorBaseWasmQuery>({
    ...queryClient,
    id: `anchor--base=${anchorProxyAddr}`,
    wasmQuery: {
      anchorBase: {
        contractAddress: anchorProxyAddr,
        query: {
          base: {
            price: {
              asset_token: '',
            },
          },
        },
      },
    },
  });
}
