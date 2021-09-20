import { useApp } from '@libs/app-provider';
import { createQueryFn } from '@libs/react-query-utils';
import {
  NebulaContants,
  NebulaContractAddress,
  StakingPoolInfoList,
  stakingPoolInfoListQuery,
} from '@nebula-js/app-fns';
import { useQuery, UseQueryResult } from 'react-query';
import { NEBULA_QUERY_KEYS } from '../../env';

const queryFn = createQueryFn(stakingPoolInfoListQuery);

export function useStakingPoolInfoListQuery(): UseQueryResult<
  StakingPoolInfoList | undefined
> {
  const { mantleFetch, mantleEndpoint, queryErrorReporter, contractAddress } =
    useApp<NebulaContractAddress, NebulaContants>();

  //const {
  //  contractAddress: { clusterFactory, terraswap, staking, cw20 },
  //} = useNebulaWebapp();
  //
  //const { browserInactive } = useBrowserInactive();

  const result = useQuery(
    [
      NEBULA_QUERY_KEYS.STAKING_POOL_INFO_LIST,
      contractAddress.cw20.NEB,
      contractAddress.staking,
      contractAddress.clusterFactory,
      contractAddress.terraswap.factory,
      mantleEndpoint,
      mantleFetch,
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
