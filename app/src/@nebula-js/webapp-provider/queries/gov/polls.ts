import { gov } from '@nebula-js/types';
import { GovPolls, govPollsQuery } from '@nebula-js/webapp-fns';
import { useBrowserInactive } from '@terra-dev/use-browser-inactive';
import { useTerraWebapp } from '@terra-money/webapp-provider';
import { useInfiniteQuery, UseInfiniteQueryResult } from 'react-query';
import { useNebulaWebapp } from '../../contexts/webapp';
import { NEBULA_QUERY_KEYS } from '../../env';

export function useGovPollsQuery(
  filter: gov.PollStatus | undefined,
  limit: number,
): UseInfiniteQueryResult<GovPolls | undefined> {
  const { mantleFetch, mantleEndpoint, queryErrorReporter, lastSyncedHeight } =
    useTerraWebapp();

  const { contractAddress } = useNebulaWebapp();

  const { browserInactive } = useBrowserInactive();

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
        lastSyncedHeight,
        mantleEndpoint,
        mantleFetch,
      );
    },
    {
      getNextPageParam: (lastPage) => {
        return lastPage.polls.polls.length < limit
          ? undefined
          : lastPage.polls.polls[lastPage.polls.polls.length - 1].id;
      },
      enabled: !browserInactive,
      onError: queryErrorReporter,
    },
  );

  return result;
}
