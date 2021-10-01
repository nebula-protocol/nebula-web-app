import { createQueryFn } from '@libs/react-query-utils';
import { ClusterInfo, clusterInfoQuery } from '@nebula-js/app-fns';
import { HumanAddr } from '@nebula-js/types';
import { useQuery, UseQueryResult } from 'react-query';
import { NEBULA_QUERY_KEYS } from '../../env';
import { useNebulaApp } from '../../hooks/useNebulaApp';

const queryFn = createQueryFn(clusterInfoQuery);

export function useClusterInfoQuery(
  clusterAddr: HumanAddr,
): UseQueryResult<ClusterInfo | undefined> {
  const { queryClient, queryErrorReporter, contractAddress } = useNebulaApp();

  const result = useQuery(
    [
      NEBULA_QUERY_KEYS.CLUSTER_INFO,
      clusterAddr,
      contractAddress.terraswap.factory,
      queryClient,
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
