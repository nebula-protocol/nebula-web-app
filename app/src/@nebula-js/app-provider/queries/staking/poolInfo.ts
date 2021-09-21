import { TERRA_QUERY_KEY, useApp } from '@libs/app-provider';
import { createQueryFn } from '@libs/react-query-utils';
import {
  NebulaContants,
  NebulaContractAddress,
  StakingPoolInfo,
  stakingPoolInfoQuery,
} from '@nebula-js/app-fns';
import { CW20Addr } from '@nebula-js/types';
import { useQuery, UseQueryResult } from 'react-query';

const queryFn = createQueryFn(stakingPoolInfoQuery);

export function useStakingPoolInfoQuery(
  tokenAddr: CW20Addr,
): UseQueryResult<StakingPoolInfo | undefined> {
  const { wasmClient, queryErrorReporter, contractAddress } = useApp<
    NebulaContractAddress,
    NebulaContants
  >();

  //const {
  //  contractAddress: { staking, terraswap },
  //} = useNebulaWebapp();

  //const { browserInactive } = useBrowserInactive();

  const result = useQuery(
    [
      TERRA_QUERY_KEY.STAKING_POOL_INFO,
      tokenAddr,
      contractAddress.staking,
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
