import { useApp } from '@libs/app-provider';
import { createQueryFn } from '@libs/react-query-utils';
import {
  ClustersList,
  clustersListQuery,
  NebulaContants,
  NebulaContractAddress,
} from '@nebula-js/app-fns';
import { useQuery, UseQueryResult } from 'react-query';
import { NEBULA_QUERY_KEYS } from '../../env';

const queryFn = createQueryFn(clustersListQuery);

export function useClustersListQuery(): UseQueryResult<
  ClustersList | undefined
> {
  const { wasmClient, queryErrorReporter, contractAddress } = useApp<
    NebulaContractAddress,
    NebulaContants
  >();

  //const {
  //  contractAddress: { clusterFactory },
  //} = useNebulaWebapp();
  //
  //const { browserInactive } = useBrowserInactive();

  const result = useQuery(
    [
      NEBULA_QUERY_KEYS.CLUSTERS_LIST,
      contractAddress.clusterFactory,
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
