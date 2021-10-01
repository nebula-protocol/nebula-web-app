import { GovVoters, govVotersQuery } from '@nebula-js/app-fns';
import { useInfiniteQuery, UseInfiniteQueryResult } from 'react-query';
import { NEBULA_QUERY_KEYS } from '../../env';
import { useNebulaApp } from '../../hooks/useNebulaApp';

export function useGovVotersQuery(
  pollId: number,
  limit: number,
): UseInfiniteQueryResult<GovVoters | undefined> {
  const { queryClient, queryErrorReporter, contractAddress } = useNebulaApp();

  const result = useInfiniteQuery(
    [NEBULA_QUERY_KEYS.GOV_VOTERS, pollId],
    ({ pageParam = undefined }) => {
      return govVotersQuery(
        contractAddress.gov,
        {
          poll_id: pollId,
          limit,
          start_after: pageParam,
        },
        queryClient,
      );
    },
    {
      getNextPageParam: (lastPage) => {
        return lastPage.voters.voters.length < limit
          ? undefined
          : lastPage.voters.voters[lastPage.voters.voters.length - 1].voter;
      },
      onError: queryErrorReporter,
    },
  );

  return result;
}
