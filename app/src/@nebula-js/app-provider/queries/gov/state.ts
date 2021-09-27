import { createQueryFn } from '@libs/react-query-utils';
import { GovState, govStateQuery } from '@nebula-js/app-fns';
import { useQuery, UseQueryResult } from 'react-query';
import { NEBULA_QUERY_KEYS } from '../../env';
import { useNebulaApp } from '../../hooks/useNebulaApp';

const queryFn = createQueryFn(govStateQuery);

export function useGovStateQuery(): UseQueryResult<GovState | undefined> {
  const { wasmClient, queryErrorReporter, contractAddress } = useNebulaApp();

  const result = useQuery(
    [NEBULA_QUERY_KEYS.GOV_STATE, contractAddress.gov, wasmClient],
    queryFn,
    {
      refetchInterval: 1000 * 60 * 5,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  return result as UseQueryResult<GovState | undefined>;
}
