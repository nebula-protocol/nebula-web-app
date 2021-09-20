import { CW20PoolInfo, cw20PoolInfoQuery } from '@libs/app-fns';
import { TERRA_QUERY_KEY } from '@libs/app-provider';
import { useApp } from '@libs/app-provider/contexts/app';
import { createQueryFn } from '@libs/react-query-utils';
import { CW20Addr, Token } from '@libs/types';
import { useQuery, UseQueryResult } from 'react-query';

const queryFn = createQueryFn(cw20PoolInfoQuery);

export function useCW20PoolInfoQuery<T extends Token>(
  tokenAddr: CW20Addr,
): UseQueryResult<CW20PoolInfo<T> | undefined> {
  const { mantleFetch, mantleEndpoint, queryErrorReporter, contractAddress } =
    useApp();

  const result = useQuery(
    [
      TERRA_QUERY_KEY.STAKING_POOL_INFO,
      tokenAddr,
      contractAddress.terraswap.factory,
      mantleEndpoint,
      mantleFetch,
    ],
    queryFn as any,
    {
      refetchInterval: 1000 * 60 * 5,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  return result as UseQueryResult<CW20PoolInfo<T>>;
}
