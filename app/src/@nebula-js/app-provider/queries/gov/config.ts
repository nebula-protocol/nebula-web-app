import { createQueryFn } from '@libs/react-query-utils';
import { GovConfig, govConfigQuery } from '@nebula-js/app-fns';
import { useQuery, UseQueryResult } from 'react-query';
import { NEBULA_QUERY_KEYS } from '../../env';
import { useNebulaApp } from '../../hooks/useNebulaApp';

const queryFn = createQueryFn(govConfigQuery);

export function useGovConfigQuery(): UseQueryResult<GovConfig | undefined> {
  const { queryClient, queryErrorReporter, contractAddress } = useNebulaApp();

  const result = useQuery(
    [NEBULA_QUERY_KEYS.GOV_CONFIG, contractAddress.gov, queryClient],
    queryFn,
    {
      refetchInterval: 1000 * 60 * 5,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  return result;
}
