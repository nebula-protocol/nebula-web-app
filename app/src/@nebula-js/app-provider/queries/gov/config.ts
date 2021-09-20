import { useApp } from '@libs/app-provider';
import { createQueryFn } from '@libs/react-query-utils';
import {
  govConfigQuery,
  NebulaContants,
  NebulaContractAddress,
} from '@nebula-js/app-fns';
import { GovConfig } from '@nebula-js/app-fns/queries/gov/config';
import { useQuery, UseQueryResult } from 'react-query';
import { NEBULA_QUERY_KEYS } from '../../env';

const queryFn = createQueryFn(govConfigQuery);

export function useGovConfigQuery(): UseQueryResult<GovConfig | undefined> {
  const { mantleFetch, mantleEndpoint, queryErrorReporter, contractAddress } =
    useApp<NebulaContractAddress, NebulaContants>();

  const result = useQuery(
    [
      NEBULA_QUERY_KEYS.GOV_CONFIG,
      contractAddress.gov,
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
