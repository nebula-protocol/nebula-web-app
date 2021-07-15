import { HumanAddr } from '@anchor-protocol/types';
import { CW20Addr, NativeDenom } from '@nebula-js/types';
import { ClusterInfo, clusterInfoQuery } from '@nebula-js/webapp-fns';
import { createQueryFn } from '@terra-dev/react-query-utils';
import { useBrowserInactive } from '@terra-dev/use-browser-inactive';
import { MantleFetch, useTerraWebapp } from '@terra-money/webapp-provider';
import { useQuery, UseQueryResult } from 'react-query';
import { useNebulaWebapp } from '../../contexts/webapp';
import { NEBULA_QUERY_KEYS } from '../../env';

const queryFn = createQueryFn(
  (
    mantleEndpoint: string,
    mantleFetch: MantleFetch,
    clusterFactoryAddr: HumanAddr,
    clusterAddr: HumanAddr,
  ) => {
    return clusterInfoQuery({
      mantleEndpoint,
      mantleFetch,
      wasmQuery: {
        clusterState: {
          contractAddress: clusterAddr,
          query: {
            cluster_state: {
              cluster_contract_address: clusterAddr,
            },
          },
        },
        clusterConfig: {
          contractAddress: clusterAddr,
          query: {
            config: {},
          },
        },
        terraswapPair: {
          contractAddress: clusterFactoryAddr,
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
  },
);

export function useClusterInfoQuery(
  clusterAddr: HumanAddr,
): UseQueryResult<ClusterInfo | undefined> {
  const { mantleFetch, mantleEndpoint, queryErrorReporter } = useTerraWebapp();

  const {
    contractAddress: { clusterFactory },
  } = useNebulaWebapp();

  const { browserInactive } = useBrowserInactive();

  const result = useQuery(
    [
      NEBULA_QUERY_KEYS.CLUSTER_INFO,
      mantleEndpoint,
      mantleFetch,
      clusterFactory,
      clusterAddr,
    ],
    queryFn,
    {
      refetchInterval: browserInactive && 1000 * 60 * 5,
      enabled: !browserInactive,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  return result;
}
