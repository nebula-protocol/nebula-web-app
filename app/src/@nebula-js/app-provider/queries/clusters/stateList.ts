import { createQueryFn } from '@libs/react-query-utils';
import { ClusterStateList, clusterStateListQuery } from '@nebula-js/app-fns';
import { useQuery, UseQueryResult } from 'react-query';
import { NEBULA_QUERY_KEYS } from '../../env';
import { useNebulaApp } from '../../hooks/useNebulaApp';

const queryFn = createQueryFn(clusterStateListQuery);

export function useClusterStateListQuery(): UseQueryResult<
  ClusterStateList | undefined
> {
  const { wasmClient, queryErrorReporter, contractAddress } = useNebulaApp();

  const result = useQuery(
    [
      NEBULA_QUERY_KEYS.CLUSTERS_LIST,
      contractAddress.clusterFactory,
      wasmClient,
    ],
    queryFn,
    {
      refetchInterval: 1000 * 60 * 5,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  return result;
}
