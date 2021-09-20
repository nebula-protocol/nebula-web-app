import { GasPrice, gasPriceCache, gasPriceQuery } from '@libs/app-fns';
import { TERRA_QUERY_KEY } from '@libs/app-provider/env';
import { createQueryFn } from '@libs/react-query-utils';
import { useQuery, UseQueryResult } from 'react-query';

const queryFn = createQueryFn((gasPriceEndpoint: string) => {
  return gasPriceQuery(gasPriceEndpoint);
});

export function useGasPriceQuery(
  gasPriceEndpoint: string,
  queryErrorReporter: ((error: unknown) => void) | undefined,
): UseQueryResult<GasPrice | undefined> {
  const result = useQuery(
    [TERRA_QUERY_KEY.TERRA_GAS_PRICE, gasPriceEndpoint],
    queryFn,
    {
      onError: queryErrorReporter,
      placeholderData: () => gasPriceCache.get(gasPriceEndpoint),
    },
  );

  return result;
}
