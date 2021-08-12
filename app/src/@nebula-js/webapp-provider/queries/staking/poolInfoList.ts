import {
  StakingPoolInfoList,
  stakingPoolInfoListQuery,
} from '@nebula-js/webapp-fns';
import { createQueryFn } from '@terra-dev/react-query-utils';
import { useBrowserInactive } from '@terra-dev/use-browser-inactive';
import { useTerraWebapp } from '@terra-money/webapp-provider';
import { useQuery, UseQueryResult } from 'react-query';
import { useNebulaWebapp } from '../../contexts/webapp';
import { NEBULA_QUERY_KEYS } from '../../env';

const queryFn = createQueryFn(stakingPoolInfoListQuery);

export function useStakingPoolInfoListQuery(): UseQueryResult<
  StakingPoolInfoList | undefined
> {
  const { mantleFetch, mantleEndpoint, queryErrorReporter } = useTerraWebapp();

  const {
    contractAddress: { clusterFactory, terraswap, staking, cw20 },
  } = useNebulaWebapp();

  const { browserInactive } = useBrowserInactive();

  const result = useQuery(
    [
      NEBULA_QUERY_KEYS.STAKING_POOL_INFO_LIST,
      cw20.NEB,
      staking,
      clusterFactory,
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
