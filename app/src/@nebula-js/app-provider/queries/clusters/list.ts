import { useApp } from '@libs/app-provider';
import { createQueryFn } from '@libs/react-query-utils';
import {
  ClustersList,
  clustersListQuery,
  NebulaContants,
  NebulaContractAddress,
} from '@nebula-js/app-fns';
import { NEBULA_QUERY_KEYS } from '@nebula-js/app-provider/env';
import { useQuery, UseQueryResult } from 'react-query';

const queryFn = createQueryFn(clustersListQuery);

export function useClustersListQuery(): UseQueryResult<
  ClustersList | undefined
> {
  const { mantleFetch, mantleEndpoint, queryErrorReporter, contractAddress } =
    useApp<NebulaContractAddress, NebulaContants>();

  //const {
  //  contractAddress: { clusterFactory },
  //} = useNebulaWebapp();
  //
  //const { browserInactive } = useBrowserInactive();

  const result = useQuery(
    [
      NEBULA_QUERY_KEYS.CLUSTERS_LIST,
      contractAddress.clusterFactory,
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
