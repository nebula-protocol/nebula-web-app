import { TEST_LCD_CLIENT } from '@libs/app-fns/test-env';
import { wasmFetch, WasmQuery } from '@libs/query-client';
import { CW20Addr, HumanAddr, terraswap } from '@libs/types';

type NebWasmQuery = {
  neb: WasmQuery<terraswap.factory.Pair, terraswap.factory.PairResponse>;
};

describe('queries/simulation', () => {
  test('should get pair contract from lcd client', async () => {
    const { neb } = await wasmFetch<NebWasmQuery>({
      ...TEST_LCD_CLIENT,
      wasmQuery: {
        neb: {
          contractAddress:
            'terra1z3y69xas85r7egusa0c7m5sam0yk97gsztqmh8f2cc6rr4s4anysudp7k0' as HumanAddr,
          query: {
            pair: {
              asset_infos: [
                {
                  native_token: {
                    denom: 'uluna',
                  },
                },
                {
                  token: {
                    contract_addr:
                      'terra103g6fdulfjl2vqc6xgme73q40syu2huw8ustpy9xg674a67sqavq62h54m' as CW20Addr,
                  },
                },
              ],
            },
          },
        },
      },
    });

    // contract_addr is anc-ust pair
    expect(neb.contract_addr).toBe(
      'terra1auf5h6xjq04t8tqqm5mm34cjrjhvme0k66xp3l97m7m2gcef2xgss07mj5',
    );
  });
});
