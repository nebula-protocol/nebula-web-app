import { govPollsQuery } from '@nebula-js/webapp-fns';
import {
  TEST_CONTRACT_ADDRESS,
  TEST_MANTLE_ENDPOINT,
} from '@nebula-js/webapp-fns/test-env';
import { defaultMantleFetch } from '@terra-dev/mantle';

describe('govPollsQuery()', () => {
  test('should get query data', async () => {
    const { polls } = await govPollsQuery({
      mantleEndpoint: TEST_MANTLE_ENDPOINT,
      mantleFetch: defaultMantleFetch,
      wasmQuery: {
        polls: {
          contractAddress: TEST_CONTRACT_ADDRESS.gov,
          query: {
            polls: {},
          },
        },
      },
    });

    expect(polls).not.toBeUndefined();
  });
});
