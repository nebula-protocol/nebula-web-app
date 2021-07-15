import { CW20Addr, HumanAddr, NativeDenom } from '@nebula-js/types';
import { clusterInfoQuery } from '@nebula-js/webapp-fns';
import {
  TEST_CONTRACT_ADDRESS,
  TEST_MANTLE_ENDPOINT,
} from '@nebula-js/webapp-fns/test-env';
import { defaultMantleFetch } from '@terra-dev/mantle';

describe('clusters/info', () => {
  test('should get result data', async () => {
    const { clusterState, clusterConfig, terraswapPair, terraswapPool } =
      await clusterInfoQuery({
        mantleEndpoint: TEST_MANTLE_ENDPOINT,
        mantleFetch: defaultMantleFetch,
        wasmQuery: {
          clusterConfig: {
            contractAddress: 'terra1qascdg0c2gsewg6c2u8e5fdgc35mhlcufvmzna',
            query: {
              config: {},
            },
          },
          clusterState: {
            contractAddress: 'terra1qascdg0c2gsewg6c2u8e5fdgc35mhlcufvmzna',
            query: {
              cluster_state: {
                cluster_contract_address:
                  'terra1qascdg0c2gsewg6c2u8e5fdgc35mhlcufvmzna' as HumanAddr,
              },
            },
          },
          terraswapPair: {
            contractAddress: TEST_CONTRACT_ADDRESS.terraswap.factory,
            query: {
              pair: {
                asset_infos: [
                  {
                    token: {
                      contract_addr: '' as CW20Addr,
                    },
                  },
                  {
                    native_token: {
                      denom: 'uusd' as NativeDenom,
                    },
                  },
                ],
              },
            },
          },
          terraswapPool: {
            contractAddress: '',
            query: {
              pool: {},
            },
          },
        },
      });

    expect(clusterConfig).not.toBeUndefined();
    expect(clusterState).not.toBeUndefined();
    expect(terraswapPair).not.toBeUndefined();
    expect(terraswapPool).not.toBeUndefined();
  });
});
