import { createQueryFn } from '@libs/react-query-utils';
import { useBrowserInactive } from '@libs/use-browser-inactive';
import { TERRA_QUERY_KEY } from '@libs/webapp-fns';
import { useTerraWebapp } from '@libs/webapp-provider';
import { CW20Addr } from '@nebula-js/types';
import { StakingPoolInfo, stakingPoolInfoQuery } from '@nebula-js/webapp-fns';
import { useQuery, UseQueryResult } from 'react-query';
import { useNebulaWebapp } from '../../contexts/webapp';

const queryFn = createQueryFn(stakingPoolInfoQuery);

export function useStakingPoolInfoQuery(
  tokenAddr: CW20Addr,
): UseQueryResult<StakingPoolInfo | undefined> {
  const { mantleFetch, mantleEndpoint, queryErrorReporter } = useTerraWebapp();

  const {
    contractAddress: { staking, terraswap },
  } = useNebulaWebapp();

  const { browserInactive } = useBrowserInactive();

  const result = useQuery(
    [
      TERRA_QUERY_KEY.STAKING_POOL_INFO,
      tokenAddr,
      staking,
      terraswap.factory,
      mantleEndpoint,
      mantleFetch,
    ],
    queryFn,
    {
      refetchInterval: browserInactive && 1000 * 60 * 5,
      enabled: !browserInactive,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  return result;
}
