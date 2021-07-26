import { HumanAddr } from '@anchor-protocol/types';
import {
  StakingClusterPoolInfoList,
  stakingClusterPoolInfoListQuery,
} from '@nebula-js/webapp-fns';
import { createQueryFn } from '@terra-dev/react-query-utils';
import { useBrowserInactive } from '@terra-dev/use-browser-inactive';
import { MantleFetch, useTerraWebapp } from '@terra-money/webapp-provider';
import { useQuery, UseQueryResult } from 'react-query';
import { useNebulaWebapp } from '../../contexts/webapp';
import { NEBULA_QUERY_KEYS } from '../../env';

const queryFn = createQueryFn(
  (
    mantleEndpoint: string,
    mantleFetch: MantleFetch,
    clusterFactoryAddr: HumanAddr,
    stakingAddr: HumanAddr,
    terraswapFactoryAddr: HumanAddr,
  ) => {
    return stakingClusterPoolInfoListQuery({
      mantleEndpoint,
      mantleFetch,
      terraswapFactoryAddr,
      stakingAddr,
      wasmQuery: {
        clusterList: {
          contractAddress: clusterFactoryAddr,
          query: {
            cluster_list: {},
          },
        },
      },
    });
  },
);

export function useStakingClusterPoolInfoListQuery(): UseQueryResult<
  StakingClusterPoolInfoList | undefined
> {
  const { mantleFetch, mantleEndpoint, queryErrorReporter } = useTerraWebapp();

  const {
    contractAddress: { clusterFactory, terraswap, staking },
  } = useNebulaWebapp();

  const { browserInactive } = useBrowserInactive();

  const result = useQuery(
    [
      NEBULA_QUERY_KEYS.STAKING_CLUSTER_POOL_INFO_LIST,
      mantleEndpoint,
      mantleFetch,
      clusterFactory,
      staking,
      terraswap.factory,
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
