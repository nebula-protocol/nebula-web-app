import { terraTreasuryTaxCapQuery } from '@libs/app-fns/queries/terra/treasuryTaxCap';
import { useApp } from '@libs/app-provider/contexts/app';
import { TERRA_QUERY_KEY } from '@libs/app-provider/env';
import { createQueryFn } from '@libs/react-query-utils';
import { NativeDenom, Token, u } from '@libs/types';
import { useQuery, UseQueryResult } from 'react-query';

const queryFn = createQueryFn(terraTreasuryTaxCapQuery);

export function useTerraTreasuryTaxCapQuery<T extends Token>(
  denom: NativeDenom,
): UseQueryResult<u<T>> {
  const { lcdEndpoint, lcdFetch, queryErrorReporter } = useApp();

  const result = useQuery(
    [TERRA_QUERY_KEY.TERRA_TREASURY_TAX_CAP, denom, lcdEndpoint, lcdFetch],
    queryFn as any,
    {
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  return result as UseQueryResult<u<T>>;
}
