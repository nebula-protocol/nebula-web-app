import { createQueryFn } from '@libs/react-query-utils';
import {
  ClusterFactoryConfig,
  clusterFactoryConfigQuery,
} from '@nebula-js/app-fns';
import { useQuery, UseQueryResult } from 'react-query';
import { NEBULA_QUERY_KEYS } from '../../env';
import { useNebulaApp } from '../../hooks/useNebulaApp';
import { Rate } from '@nebula-js/types';
import { useMemo } from 'react';

const queryFn = createQueryFn(clusterFactoryConfigQuery);

export function useClusterFactoryConfigQuery(): UseQueryResult<
  ClusterFactoryConfig | undefined
> {
  const { queryClient, queryErrorReporter, contractAddress } = useNebulaApp();

  const result = useQuery(
    [
      NEBULA_QUERY_KEYS.CLUSTER_FACTORY_CONFIG,
      contractAddress.clusterFactory,
      queryClient,
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

export function useProtocolFee(): Rate {
  const { data: { clusterFactoryConfig } = {} } =
    useClusterFactoryConfigQuery();

  return useMemo<Rate>(() => {
    // TODO
    return clusterFactoryConfig?.protocol_fee_rate ?? ('0.001' as Rate);
  }, [clusterFactoryConfig?.protocol_fee_rate]);
}
