import { createQueryFn } from '@libs/react-query-utils';
import {
  StakingPoolInfoList,
  stakingPoolInfoListQuery,
} from '@nebula-js/app-fns';
import { useQuery, UseQueryResult } from 'react-query';
import { NEBULA_QUERY_KEYS } from '../../env';
import { useNebulaApp } from '../../hooks/useNebulaApp';

const queryFn = createQueryFn(stakingPoolInfoListQuery);

export function useStakingPoolInfoListQuery(): UseQueryResult<
  StakingPoolInfoList | undefined
> {
  const { wasmClient, queryErrorReporter, contractAddress } = useNebulaApp();

  const result = useQuery(
    [
      NEBULA_QUERY_KEYS.STAKING_POOL_INFO_LIST,
      contractAddress.cw20.NEB,
      contractAddress.staking,
      contractAddress.clusterFactory,
      contractAddress.terraswap.factory,
      wasmClient,
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
