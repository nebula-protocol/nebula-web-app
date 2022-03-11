import { IncentiveReward, IncentiveRewardQuery } from '@nebula-js/app-fns';
import { createQueryFn } from '@libs/react-query-utils';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useQuery, UseQueryResult } from 'react-query';
import { useNebulaApp } from '../../hooks/useNebulaApp';
import { NEBULA_QUERY_KEYS } from '../../env';

const queryFn = createQueryFn(IncentiveRewardQuery);

export function useIncentiveRewardQuery(): UseQueryResult<
  IncentiveReward | undefined
> {
  const { queryClient, queryErrorReporter, contractAddress } = useNebulaApp();

  const connectedWallet = useConnectedWallet();

  const result = useQuery(
    [
      NEBULA_QUERY_KEYS.INCENTIVE_REWARD,
      contractAddress.incentives,
      connectedWallet?.walletAddress,
      queryClient,
    ],
    queryFn,
    {
      enabled: !!connectedWallet,
      keepPreviousData: false,
      onError: queryErrorReporter,
    },
  );

  return result;
}
