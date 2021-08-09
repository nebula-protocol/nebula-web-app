import { govPollsQuery } from '@nebula-js/webapp-fns';
import {
  TEST_CONTRACT_ADDRESS,
  TEST_MANTLE_ENDPOINT,
} from '@nebula-js/webapp-fns/test-env';
import { defaultMantleFetch } from '@terra-dev/mantle';

describe('govPollsQuery()', () => {
  test('should get query data', async () => {
    const { polls } = await govPollsQuery(
      TEST_CONTRACT_ADDRESS.gov,
      {},
      TEST_MANTLE_ENDPOINT,
      defaultMantleFetch,
    );

    expect(polls).not.toBeUndefined();
  });
});
