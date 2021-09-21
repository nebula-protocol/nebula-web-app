import { useApp } from '@libs/app-provider';
import { createQueryFn } from '@libs/react-query-utils';
import {
  ClustersInfoList,
  clustersInfoListQuery,
  NebulaContants,
  NebulaContractAddress,
} from '@nebula-js/app-fns';
import { useQuery, UseQueryResult } from 'react-query';
import { NEBULA_QUERY_KEYS } from '../../env';

const queryFn = createQueryFn(clustersInfoListQuery);

export function useClustersInfoListQuery(): UseQueryResult<
  ClustersInfoList | undefined
> {
  const { wasmClient, queryErrorReporter, contractAddress } = useApp<
    NebulaContractAddress,
    NebulaContants
  >();

  //const {
  //  contractAddress: { clusterFactory, terraswap },
  //} = useNebulaWebapp();
  //
  //const { browserInactive } = useBrowserInactive();

  const result = useQuery(
    [
      NEBULA_QUERY_KEYS.CLUSTERS_LIST,
      contractAddress.clusterFactory,
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
