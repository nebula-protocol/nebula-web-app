import { CW20Addr } from '@nebula-js/types';
import { StakingPoolInfo, stakingPoolInfoQuery } from '@nebula-js/webapp-fns';
import { NEBULA_QUERY_KEYS } from '@nebula-js/webapp-provider/env';
import { createQueryFn } from '@terra-dev/react-query-utils';
import { useBrowserInactive } from '@terra-dev/use-browser-inactive';
import { useTerraWebapp } from '@terra-money/webapp-provider';
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
      NEBULA_QUERY_KEYS.STAKING_POOL_INFO,
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
