import { govConfigQuery } from '@nebula-js/webapp-fns';
import { GovConfig } from '@nebula-js/webapp-fns/queries/gov/config';
import { createQueryFn } from '@terra-dev/react-query-utils';
import { useBrowserInactive } from '@terra-dev/use-browser-inactive';
import { useTerraWebapp } from '@terra-money/webapp-provider';
import { useQuery, UseQueryResult } from 'react-query';
import { useNebulaWebapp } from '../../contexts/webapp';
import { NEBULA_QUERY_KEYS } from '../../env';

const queryFn = createQueryFn(govConfigQuery);

export function useGovConfigQuery(): UseQueryResult<GovConfig | undefined> {
  const { mantleFetch, mantleEndpoint, queryErrorReporter } = useTerraWebapp();

  const { contractAddress } = useNebulaWebapp();

  const { browserInactive } = useBrowserInactive();

  const result = useQuery(
    [
      NEBULA_QUERY_KEYS.GOV_CONFIG,
      contractAddress.gov,
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
