import { govPollsQuery } from '@nebula-js/app-fns';
import {
  TEST_CONTRACT_ADDRESS,
  TEST_LCD_CLIENT,
} from '@nebula-js/app-fns/test-env';

describe('govPollsQuery()', () => {
  test('should get query data', async () => {
    const { polls } = await govPollsQuery(
      TEST_CONTRACT_ADDRESS.gov,
      {},
      TEST_CONTRACT_ADDRESS.cw20.NEB,
      TEST_CONTRACT_ADDRESS,
      () => Promise.resolve(100000),
      TEST_LCD_CLIENT,
    );

    expect(polls).not.toBeUndefined();
  });
});
