import { ClustersList, clustersListQuery } from '@nebula-js/webapp-fns';
import { NEBULA_QUERY_KEYS } from '@nebula-js/webapp-provider/env';
import { createQueryFn } from '@packages/react-query-utils';
import { useBrowserInactive } from '@packages/use-browser-inactive';
import { useTerraWebapp } from '@packages/webapp-provider';
import { useQuery, UseQueryResult } from 'react-query';
import { useNebulaWebapp } from '../../contexts/webapp';

const queryFn = createQueryFn(clustersListQuery);

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
      clusterFactory,
      mantleEndpoint,
      mantleFetch,
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
