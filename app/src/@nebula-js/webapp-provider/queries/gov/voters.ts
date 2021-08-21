import { GovVoters, govVotersQuery } from '@nebula-js/webapp-fns';
import { useBrowserInactive } from '@packages/use-browser-inactive';
import { useTerraWebapp } from '@packages/webapp-provider';
import { useInfiniteQuery, UseInfiniteQueryResult } from 'react-query';
import { useNebulaWebapp } from '../../contexts/webapp';
import { NEBULA_QUERY_KEYS } from '../../env';

export function useGovVotersQuery(
  pollId: number,
  limit: number,
): UseInfiniteQueryResult<GovVoters | undefined> {
  const { mantleFetch, mantleEndpoint, queryErrorReporter } = useTerraWebapp();

  const { contractAddress } = useNebulaWebapp();

  const { browserInactive } = useBrowserInactive();

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
        mantleEndpoint,
        mantleFetch,
      );
    },
    {
      getNextPageParam: (lastPage) => {
        return lastPage.voters.voters.length < limit
          ? undefined
          : lastPage.voters.voters[lastPage.voters.voters.length - 1].voter;
      },
      enabled: !browserInactive,
      onError: queryErrorReporter,
    },
  );

  return result;
}
