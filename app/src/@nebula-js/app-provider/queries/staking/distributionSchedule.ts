import { TERRA_QUERY_KEY } from '@libs/app-provider';
import { createQueryFn } from '@libs/react-query-utils';
import {
  distributionScheduleQuery,
  DistributionSchedule,
} from '@nebula-js/app-fns';
import { useQuery, UseQueryResult } from 'react-query';
import { useNebulaApp } from '../../hooks/useNebulaApp';

const queryFn = createQueryFn(distributionScheduleQuery);

export function useDistributionScheduleQuery(): UseQueryResult<
  DistributionSchedule | undefined
> {
  const { queryClient, queryErrorReporter, contractAddress } = useNebulaApp();

  const result = useQuery(
    [
      TERRA_QUERY_KEY.DISTRIBUTION_SCHEDULE,
      contractAddress.clusterFactory,
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
