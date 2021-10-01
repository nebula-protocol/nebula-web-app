import { TERRA_QUERY_KEY } from '@libs/app-provider';
import { createQueryFn } from '@libs/react-query-utils';
import { StakingPoolInfo, stakingPoolInfoQuery } from '@nebula-js/app-fns';
import { CW20Addr } from '@nebula-js/types';
import { useQuery, UseQueryResult } from 'react-query';
import { useNebulaApp } from '../../hooks/useNebulaApp';

const queryFn = createQueryFn(stakingPoolInfoQuery);

export function useStakingPoolInfoQuery(
  tokenAddr: CW20Addr,
): UseQueryResult<StakingPoolInfo | undefined> {
  const { queryClient, queryErrorReporter, contractAddress } = useNebulaApp();

  const result = useQuery(
    [
      TERRA_QUERY_KEY.STAKING_POOL_INFO,
      tokenAddr,
      contractAddress.staking,
      contractAddress.terraswap.factory,
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
