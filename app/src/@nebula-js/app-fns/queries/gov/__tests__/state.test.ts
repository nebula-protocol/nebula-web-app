import { govStateQuery } from '@nebula-js/app-fns';
import {
  TEST_CONTRACT_ADDRESS,
  TEST_HIVE_CLIENT,
} from '@nebula-js/app-fns/test-env';

describe('govStateQuery()', () => {
  test('should get query data', async () => {
    const { govState } = await govStateQuery(
      TEST_CONTRACT_ADDRESS.gov,
      TEST_HIVE_CLIENT,
    );

    expect(govState).not.toBeUndefined();
  });
});
