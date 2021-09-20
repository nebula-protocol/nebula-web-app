import { terraTreasuryTaxRateQuery } from '@libs/app-fns';
import { createQueryFn } from '@libs/react-query-utils';
import { Rate } from '@libs/types';
import { useQuery, UseQueryResult } from 'react-query';
import { useApp } from '../../contexts/app';
import { TERRA_QUERY_KEY } from '../../env';

const queryFn = createQueryFn(terraTreasuryTaxRateQuery);

export function useTerraTreasuryTaxRateQuery(): UseQueryResult<Rate> {
  const { lcdEndpoint, lcdFetch, queryErrorReporter } = useApp();

  const result = useQuery(
    [TERRA_QUERY_KEY.TERRA_TREASURY_TAX_RATE, lcdEndpoint, lcdFetch],
    queryFn,
    {
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  return result;
}
