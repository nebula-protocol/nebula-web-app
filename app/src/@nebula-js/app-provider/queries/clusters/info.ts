import { useApp } from '@libs/app-provider';
import { createQueryFn } from '@libs/react-query-utils';
import {
  ClusterInfo,
  clusterInfoQuery,
  NebulaContants,
  NebulaContractAddress,
} from '@nebula-js/app-fns';
import { HumanAddr } from '@nebula-js/types';
import { useQuery, UseQueryResult } from 'react-query';
import { NEBULA_QUERY_KEYS } from '../../env';

const queryFn = createQueryFn(clusterInfoQuery);

export function useClusterInfoQuery(
  clusterAddr: HumanAddr,
): UseQueryResult<ClusterInfo | undefined> {
  const { wasmClient, queryErrorReporter, contractAddress } = useApp<
    NebulaContractAddress,
    NebulaContants
  >();

  const result = useQuery(
    [
      NEBULA_QUERY_KEYS.CLUSTER_INFO,
      clusterAddr,
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
