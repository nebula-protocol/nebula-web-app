import { govStateQuery } from '@nebula-js/webapp-fns';
import {
  TEST_CONTRACT_ADDRESS,
  TEST_MANTLE_ENDPOINT,
} from '@nebula-js/webapp-fns/test-env';
import { defaultMantleFetch } from '@packages/mantle';

describe('govStateQuery()', () => {
  test('should get query data', async () => {
    const { govState } = await govStateQuery(
      TEST_CONTRACT_ADDRESS.gov,
      TEST_MANTLE_ENDPOINT,
      defaultMantleFetch,
    );

    expect(govState).not.toBeUndefined();
  });
});
