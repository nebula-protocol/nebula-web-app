import { HumanAddr } from '@nebula-js/types';
import { clusterInfoQuery } from '@nebula-js/webapp-fns';
import {
  TEST_CONTRACT_ADDRESS,
  TEST_MANTLE_ENDPOINT,
} from '@nebula-js/webapp-fns/test-env';
import { defaultMantleFetch } from '@packages/mantle';

describe.skip('clusters/info', () => {
  test('should get result data', async () => {
    //@ts-ignore
    process.env.MANTLE_GRAPHQL_PRINT = true;

    const { clusterState, clusterConfig, terraswapPair, terraswapPool } =
      await clusterInfoQuery(
        'terra1rkgpmrqmddwtq48e5mr4vsps53vudmd4mgvfkz' as HumanAddr,
        TEST_CONTRACT_ADDRESS.terraswap.factory,
        TEST_MANTLE_ENDPOINT,
        defaultMantleFetch,
      );

    expect(clusterConfig).not.toBeUndefined();
    expect(clusterState).not.toBeUndefined();
    expect(terraswapPair).not.toBeUndefined();
    expect(terraswapPool).not.toBeUndefined();
  });

  test('should get terraswap pool result', () => {});
});
