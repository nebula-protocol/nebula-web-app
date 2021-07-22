import { CW20Addr, NativeDenom, terraswap } from '@nebula-js/types';
import {
  TEST_CONTRACT_ADDRESS,
  TEST_MANTLE_ENDPOINT,
} from '@nebula-js/webapp-fns/test-env';
import { defaultMantleFetch, WasmQuery } from '@terra-dev/mantle';
import { mantle } from '@terra-money/webapp-fns';

type AncWasmQuery = {
  anc: WasmQuery<terraswap.factory.Pair, terraswap.factory.PairResponse>;
};

describe('queries/simulation', () => {
  test('should get pair contract', async () => {
    const { anc } = await mantle<AncWasmQuery>({
      mantleEndpoint: TEST_MANTLE_ENDPOINT,
      mantleFetch: defaultMantleFetch,
      variables: {},
      wasmQuery: {
        anc: {
          contractAddress: TEST_CONTRACT_ADDRESS.terraswap.factory,
          query: {
            pair: {
              asset_infos: [
                {
                  native_token: {
                    denom: 'uusd' as NativeDenom,
                  },
                },
                {
                  token: {
                    contract_addr:
                      'terra1747mad58h0w4y589y3sk84r5efqdev9q4r02pc' as CW20Addr,
                  },
                },
              ],
            },
          },
        },
      },
    });

    // contract_addr is anc-ust pair
    expect(anc.contract_addr).toBe(
      'terra1wfvczps2865j0awnurk9m04u7wdmd6qv3fdnvz',
    );
  });
});
