import { useApp } from '@libs/app-provider';
import { createQueryFn } from '@libs/react-query-utils';
import {
  ClusterStateList,
  clusterStateListQuery,
  NebulaContants,
  NebulaContractAddress,
} from '@nebula-js/app-fns';
import { useQuery, UseQueryResult } from 'react-query';
import { NEBULA_QUERY_KEYS } from '../../env';

const queryFn = createQueryFn(clusterStateListQuery);

export function useClusterStateListQuery(): UseQueryResult<
  ClusterStateList | undefined
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
