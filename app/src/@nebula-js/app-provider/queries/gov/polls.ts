import { GovPolls, govPollsQuery } from '@nebula-js/app-fns';
import { gov } from '@nebula-js/types';
import { useInfiniteQuery, UseInfiniteQueryResult } from 'react-query';
import { NEBULA_QUERY_KEYS } from '../../env';
import { useNebulaApp } from '../../hooks/useNebulaApp';

export function useGovPollsQuery(
  filter: gov.PollStatus | undefined,
  limit: number,
): UseInfiniteQueryResult<GovPolls | undefined> {
  const { queryClient, queryErrorReporter, lastSyncedHeight, contractAddress } =
    useNebulaApp();

  const result = useInfiniteQuery(
    [NEBULA_QUERY_KEYS.GOV_POLLS, filter],
    ({ pageParam = undefined }) => {
      return govPollsQuery(
        contractAddress.gov,
        {
          filter,
          limit,
          start_after: pageParam,
        },
        contractAddress.cw20.NEB,
        contractAddress,
        lastSyncedHeight,
        queryClient,
      );
    },
    {
      getNextPageParam: (lastPage) => {
        return lastPage.polls.polls.length < limit
          ? undefined
          : lastPage.polls.polls[lastPage.polls.polls.length - 1].id;
      },
      onError: queryErrorReporter,
    },
  );

  return result;
}
