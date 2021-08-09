import { clustersInfoListQuery } from '@nebula-js/webapp-fns';
import {
  TEST_CONTRACT_ADDRESS,
  TEST_MANTLE_ENDPOINT,
} from '@nebula-js/webapp-fns/test-env';
import { defaultMantleFetch } from '@terra-dev/mantle';

describe('clusters/infoList', () => {
  test('should get result data', async () => {
    const infoList = await clustersInfoListQuery(
      TEST_CONTRACT_ADDRESS.clusterFactory,
      TEST_CONTRACT_ADDRESS.terraswap.factory,
      TEST_MANTLE_ENDPOINT,
      defaultMantleFetch,
    );

    expect(Array.isArray(infoList)).toBeTruthy();
  });
});
