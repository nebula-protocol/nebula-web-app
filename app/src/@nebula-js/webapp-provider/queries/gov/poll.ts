import { GovPoll, govPollQuery } from '@nebula-js/webapp-fns';
import { createQueryFn } from '@terra-dev/react-query-utils';
import { useBrowserInactive } from '@terra-dev/use-browser-inactive';
import { useTerraWebapp } from '@terra-money/webapp-provider';
import { useQuery, UseQueryResult } from 'react-query';
import { useNebulaWebapp } from '../../contexts/webapp';
import { NEBULA_QUERY_KEYS } from '../../env';

const queryFn = createQueryFn(govPollQuery);

export function useGovPollQuery(
  pollId: number | undefined,
): UseQueryResult<GovPoll | undefined> {
  const { mantleFetch, mantleEndpoint, queryErrorReporter, lastSyncedHeight } =
    useTerraWebapp();

  const { contractAddress } = useNebulaWebapp();

  const { browserInactive } = useBrowserInactive();

  const result = useQuery(
    [
      NEBULA_QUERY_KEYS.GOV_POLL,
      contractAddress.gov,
      pollId!,
      contractAddress.cw20.NEB,
      lastSyncedHeight,
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
