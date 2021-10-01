import { createQueryFn } from '@libs/react-query-utils';
import { GovPoll, govPollQuery } from '@nebula-js/app-fns';
import { useQuery, UseQueryResult } from 'react-query';
import { NEBULA_QUERY_KEYS } from '../../env';
import { useNebulaApp } from '../../hooks/useNebulaApp';

const queryFn = createQueryFn(govPollQuery);

export function useGovPollQuery(
  pollId: number | undefined,
): UseQueryResult<GovPoll | undefined> {
  const { queryClient, queryErrorReporter, lastSyncedHeight, contractAddress } =
    useNebulaApp();

  const result = useQuery(
    [
      NEBULA_QUERY_KEYS.GOV_POLL,
      contractAddress.gov,
      pollId!,
      contractAddress.cw20.NEB,
      lastSyncedHeight,
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
