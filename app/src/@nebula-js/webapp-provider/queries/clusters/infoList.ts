import { HumanAddr } from '@anchor-protocol/types';
import { ClustersInfoList, clustersInfoListQuery } from '@nebula-js/webapp-fns';
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
    terraswapFactoryAddr: HumanAddr,
  ) => {
    return clustersInfoListQuery({
      mantleEndpoint,
      mantleFetch,
      terraswapFactoryAddr,
      wasmQuery: {
        clusterList: {
          contractAddress: clusterFactoryAddr,
          query: {
            cluster_list: {},
          },
        },
      },
    });
  },
);

export function useClustersInfoListQuery(): UseQueryResult<
  ClustersInfoList | undefined
> {
  const { mantleFetch, mantleEndpoint, queryErrorReporter } = useTerraWebapp();

  const {
    contractAddress: { clusterFactory, terraswap },
  } = useNebulaWebapp();

  const { browserInactive } = useBrowserInactive();

  const result = useQuery(
    [
      NEBULA_QUERY_KEYS.CLUSTERS_LIST,
      mantleEndpoint,
      mantleFetch,
      clusterFactory,
      terraswap.factory,
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
