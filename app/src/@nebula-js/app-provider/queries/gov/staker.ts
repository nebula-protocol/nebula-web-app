import { createQueryFn } from '@libs/react-query-utils';
import { GovStaker, govStakerQuery } from '@nebula-js/app-fns';
import { HumanAddr } from '@nebula-js/types';
import { useQuery, UseQueryResult } from 'react-query';
import { NEBULA_QUERY_KEYS } from '../../env';
import { useNebulaApp } from '../../hooks/useNebulaApp';

const queryFn = createQueryFn(govStakerQuery);

export function useGovStakerQuery(
  walletAddr: HumanAddr | undefined,
): UseQueryResult<GovStaker | undefined> {
  const { queryClient, queryErrorReporter, contractAddress } = useNebulaApp();

  const result = useQuery(
    [NEBULA_QUERY_KEYS.GOV_STAKER, walletAddr, contractAddress.gov, queryClient],
    queryFn,
    {
      refetchInterval: 1000 * 60 * 5,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  return result as UseQueryResult<GovStaker | undefined>;
}
