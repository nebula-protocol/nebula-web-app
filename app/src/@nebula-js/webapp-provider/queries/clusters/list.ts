import { HumanAddr } from '@anchor-protocol/types';
import { ClustersList, clustersListQuery } from '@nebula-js/webapp-fns';
import { NEBULA_QUERY_KEYS } from '@nebula-js/webapp-provider/env';
import { createQueryFn } from '@terra-dev/react-query-utils';
import { useBrowserInactive } from '@terra-dev/use-browser-inactive';
import { MantleFetch, useTerraWebapp } from '@terra-money/webapp-provider';
import { useQuery, UseQueryResult } from 'react-query';
import { useNebulaWebapp } from '../../contexts/webapp';

const queryFn = createQueryFn(
  (
    mantleEndpoint: string,
    mantleFetch: MantleFetch,
    clusterFactoryAddr: HumanAddr,
  ) => {
    return clustersListQuery({
      mantleEndpoint,
      mantleFetch,
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

export function useClustersListQuery(): UseQueryResult<
  ClustersList | undefined
> {
  const { mantleFetch, mantleEndpoint, queryErrorReporter } = useTerraWebapp();

  const {
    contractAddress: { clusterFactory },
  } = useNebulaWebapp();

  const { browserInactive } = useBrowserInactive();

  const result = useQuery(
    [
      NEBULA_QUERY_KEYS.CLUSTERS_LIST,
      mantleEndpoint,
      mantleFetch,
      clusterFactory,
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
