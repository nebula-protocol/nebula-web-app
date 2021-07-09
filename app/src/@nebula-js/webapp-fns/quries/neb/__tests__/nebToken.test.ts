import { nebTokenQuery } from '@nebula-js/webapp-fns';
import {
  TEST_CONTRACT_ADDRESS,
  TEST_MANTLE_ENDPOINT,
} from '@nebula-js/webapp-fns/test-env';
import { defaultMantleFetch } from '@terra-dev/mantle';

describe('nebTokenQuery()', () => {
  test('should get query data', async () => {
    const { nebTokenInfo } = await nebTokenQuery({
      mantleEndpoint: TEST_MANTLE_ENDPOINT,
      mantleFetch: defaultMantleFetch,
      wasmQuery: {
        nebTokenInfo: {
          contractAddress: TEST_CONTRACT_ADDRESS.cw20.NEB,
          query: {
            token_info: {},
          },
        },
      },
    });

    expect(nebTokenInfo).not.toBeUndefined();
  });
});
