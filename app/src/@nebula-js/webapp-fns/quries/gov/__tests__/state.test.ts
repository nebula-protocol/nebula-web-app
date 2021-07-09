import { govStateQuery } from '@nebula-js/webapp-fns';
import {
  TEST_CONTRACT_ADDRESS,
  TEST_MANTLE_ENDPOINT,
} from '@nebula-js/webapp-fns/test-env';
import { defaultMantleFetch } from '@terra-dev/mantle';

describe('govStateQuery()', () => {
  test('should get query data', async () => {
    const { govState } = await govStateQuery({
      mantleEndpoint: TEST_MANTLE_ENDPOINT,
      mantleFetch: defaultMantleFetch,
      wasmQuery: {
        govState: {
          contractAddress: TEST_CONTRACT_ADDRESS.gov,
          query: {
            state: {},
          },
        },
      },
    });

    expect(govState).not.toBeUndefined();
  });
});
