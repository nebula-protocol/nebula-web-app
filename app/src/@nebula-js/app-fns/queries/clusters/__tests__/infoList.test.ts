import { clustersInfoListQuery } from '@nebula-js/app-fns';
import {
  TEST_CONTRACT_ADDRESS,
  TEST_LCD_CLIENT,
} from '@nebula-js/app-fns/test-env';

describe('clusters/infoList', () => {
  test('should get result data', async () => {
    const infoList = await clustersInfoListQuery(
      TEST_CONTRACT_ADDRESS.clusterFactory,
      TEST_CONTRACT_ADDRESS.terraswap.factory,
      TEST_LCD_CLIENT,
    );

    expect(Array.isArray(infoList)).toBeTruthy();
  });
});
