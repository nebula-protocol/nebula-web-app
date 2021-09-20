import { CW20Balance, cw20BalanceQuery } from '@libs/app-fns';
import { TERRA_QUERY_KEY } from '@libs/app-provider';
import { useApp } from '@libs/app-provider/contexts/app';
import { createQueryFn } from '@libs/react-query-utils';
import { CW20Addr, HumanAddr, Token, u } from '@libs/types';
import { useMemo } from 'react';
import { useQuery, UseQueryResult } from 'react-query';

const queryFn = createQueryFn(cw20BalanceQuery);

export function useCW20BalanceQuery<T extends Token>(
  tokenAddr: CW20Addr | undefined,
  walletAddr: HumanAddr | undefined,
): UseQueryResult<CW20Balance<T> | undefined> {
  const { mantleFetch, mantleEndpoint, queryErrorReporter } = useApp();

  const result = useQuery(
    [
      TERRA_QUERY_KEY.CW20_BALANCE,
      walletAddr,
      tokenAddr,
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

  return result as UseQueryResult<CW20Balance<T> | undefined>;
}

export function useCW20Balance<T extends Token>(
  tokenAddr: CW20Addr | undefined,
  walletAddr: HumanAddr | undefined,
): u<T> {
  const { data: { tokenBalance } = {} } = useCW20BalanceQuery<T>(
    tokenAddr,
    walletAddr,
  );

  return useMemo<u<T>>(() => {
    return tokenBalance?.balance ?? ('0' as u<T>);
  }, [tokenBalance?.balance]);
}
