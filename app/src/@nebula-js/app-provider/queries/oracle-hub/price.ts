import { createQueryFn } from '@libs/react-query-utils';
import { oracleUSDPriceQuery, OraclePriceInUSD } from '@nebula-js/app-fns';
import { useQuery, UseQueryResult } from 'react-query';
import { NEBULA_QUERY_KEYS } from '../../env';
import { useNebulaApp } from '../../hooks/useNebulaApp';
import big, { Big } from 'big.js';
import { u, UST } from '@nebula-js/types';

const queryFn = createQueryFn(oracleUSDPriceQuery);

export function useOracleUSDPriceQuery(
  symbol: string,
): UseQueryResult<OraclePriceInUSD | undefined> {
  const { queryClient, queryErrorReporter, contractAddress } = useNebulaApp();

  const result = useQuery(
    [
      NEBULA_QUERY_KEYS.ORACLE_PRICE,
      contractAddress.oracleHub,
      symbol,
      queryClient,
    ],
    queryFn,
    {
      refetchInterval: 1000 * 60 * 1,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  return result;
}

export function useLunaPrice() {
  const { data } = useOracleUSDPriceQuery('LUNA');

  return data?.oraclePrice?.rate
    ? (big(data.oraclePrice.rate) as u<UST<Big>>)
    : undefined;
}
