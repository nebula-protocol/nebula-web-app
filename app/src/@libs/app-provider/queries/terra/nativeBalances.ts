import {
  EMPTY_NATIVE_BALANCES,
  NativeBalances,
  pickNativeBalance,
  terraNativeBalancesQuery,
} from '@libs/app-fns/queries/terra/nativeBalances';
import { useApp } from '@libs/app-provider/contexts/app';
import { TERRA_QUERY_KEY } from '@libs/app-provider/env';
import { createQueryFn } from '@libs/react-query-utils';
import { HumanAddr, NativeDenom, Token, u } from '@libs/types';
import { useConnectedWallet } from '@terra-dev/use-wallet';
import { useMemo } from 'react';
import { useQuery, UseQueryResult } from 'react-query';

const queryFn = createQueryFn(terraNativeBalancesQuery);

export function useTerraNativeBalancesQuery(
  walletAddr?: HumanAddr,
): UseQueryResult<NativeBalances | undefined> {
  const { lcdEndpoint, lcdFetch, queryErrorReporter } = useApp();

  const connectedWallet = useConnectedWallet();

  const result = useQuery(
    [
      TERRA_QUERY_KEY.TERRA_NATIVE_BALANCES,
      walletAddr ?? connectedWallet?.walletAddress,
      lcdEndpoint,
      lcdFetch,
    ],
    queryFn,
    {
      refetchInterval: !!connectedWallet && 1000 * 60 * 5,
      keepPreviousData: true,
      onError: queryErrorReporter,
      placeholderData: () => EMPTY_NATIVE_BALANCES,
    },
  );

  return result;
}

export function useTerraNativeBalances(walletAddr?: HumanAddr): NativeBalances {
  const { data: nativeBalances = EMPTY_NATIVE_BALANCES } =
    useTerraNativeBalancesQuery(walletAddr);

  return nativeBalances;
}

export function useTerraNativeBalanceQuery<T extends Token>(
  denom: NativeDenom,
  walletAddr?: HumanAddr,
): u<T> {
  const { data: nativeBalances = EMPTY_NATIVE_BALANCES } =
    useTerraNativeBalancesQuery(walletAddr);

  return useMemo<u<T>>(() => {
    return pickNativeBalance(denom, nativeBalances);
  }, [denom, nativeBalances]);
}
