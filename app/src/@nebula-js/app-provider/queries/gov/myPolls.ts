import { createQueryFn } from '@libs/react-query-utils';
import { GovMyPolls, govMyPollsQuery } from '@nebula-js/app-fns';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useQuery, UseQueryResult } from 'react-query';
import { NEBULA_QUERY_KEYS } from '../../env';
import { useNebulaApp } from '../../hooks/useNebulaApp';

const queryFn = createQueryFn(govMyPollsQuery);

export function useGovMyPollsQuery(): UseQueryResult<GovMyPolls | undefined> {
  const connectedWallet = useConnectedWallet();

  const { queryClient, queryErrorReporter, lastSyncedHeight, contractAddress } =
    useNebulaApp();

  const result = useQuery(
    [
      NEBULA_QUERY_KEYS.GOV_MY_POLLS,
      connectedWallet?.walletAddress,
      contractAddress.gov,
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
