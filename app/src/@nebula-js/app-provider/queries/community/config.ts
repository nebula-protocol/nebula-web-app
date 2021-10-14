import { createQueryFn } from '@libs/react-query-utils';
import { CommunityConfig, communityConfigQuery } from '@nebula-js/app-fns';
import { useQuery, UseQueryResult } from 'react-query';
import { NEBULA_QUERY_KEYS } from '../../env';
import { useNebulaApp } from '../../hooks/useNebulaApp';

const queryFn = createQueryFn(communityConfigQuery);

export function useCommunityConfigQuery(): UseQueryResult<
  CommunityConfig | undefined
> {
  const { queryClient, queryErrorReporter, contractAddress } = useNebulaApp();

  const result = useQuery(
    [
      NEBULA_QUERY_KEYS.COMMUNITY_CONFIG,
      contractAddress.community,
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
