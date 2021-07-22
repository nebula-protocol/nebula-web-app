import { clustersInfoListQuery } from '@nebula-js/webapp-fns';
import {
  TEST_CONTRACT_ADDRESS,
  TEST_MANTLE_ENDPOINT,
} from '@nebula-js/webapp-fns/test-env';
import { defaultMantleFetch } from '@terra-dev/mantle';

describe('clusters/infoList', () => {
  test('should get result data', async () => {
    const infoList = await clustersInfoListQuery({
      mantleEndpoint: TEST_MANTLE_ENDPOINT,
      mantleFetch: defaultMantleFetch,
      terraswapFactoryAddr: TEST_CONTRACT_ADDRESS.terraswap.factory,
      wasmQuery: {
        clusterList: {
          contractAddress: TEST_CONTRACT_ADDRESS.clusterFactory,
          query: {
            cluster_list: {},
          },
        },
      },
    });

    expect(Array.isArray(infoList)).toBeTruthy();
  });
});
