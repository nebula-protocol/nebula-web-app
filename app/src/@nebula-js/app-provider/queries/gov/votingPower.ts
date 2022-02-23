import { createQueryFn } from '@libs/react-query-utils';
import { GovVotingPower, govVotingPowerQuery } from '@nebula-js/app-fns';
import { HumanAddr } from '@nebula-js/types';
import { useQuery, UseQueryResult } from 'react-query';
import { NEBULA_QUERY_KEYS } from '../../env';
import { useNebulaApp } from '../../hooks/useNebulaApp';

const queryFn = createQueryFn(govVotingPowerQuery);

// TODO: remove it, it doesn't use any more
export function useGovVotingPowerQuery(
  walletAddr: HumanAddr | undefined,
): UseQueryResult<GovVotingPower | undefined> {
  const { queryClient, queryErrorReporter, contractAddress } = useNebulaApp();

  const result = useQuery(
    [
      NEBULA_QUERY_KEYS.GOV_VOTING_POWER,
      walletAddr,
      contractAddress.gov,
      queryClient,
    ],
    queryFn,
    {
      refetchInterval: 1000 * 60 * 5,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  return result as UseQueryResult<GovVotingPower | undefined>;
}
