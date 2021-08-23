import { CW20Addr, HumanAddr, Token } from '@nebula-js/types';
import { CW20Balance, cw20BalanceQuery } from '@nebula-js/webapp-fns';
import { createQueryFn } from '@libs/react-query-utils';
import { useBrowserInactive } from '@libs/use-browser-inactive';
import { useTerraWebapp } from '@libs/webapp-provider';
import { useQuery, UseQueryResult } from 'react-query';
import { NEBULA_QUERY_KEYS } from '../../env';

const queryFn = createQueryFn(cw20BalanceQuery);

export function useCW20BalanceQuery<T extends Token>(
  tokenAddr: CW20Addr | undefined,
  walletAddr: HumanAddr | undefined,
): UseQueryResult<CW20Balance<T> | undefined> {
  const { mantleFetch, mantleEndpoint, queryErrorReporter } = useTerraWebapp();

  const { browserInactive } = useBrowserInactive();

  const result = useQuery(
    [
      NEBULA_QUERY_KEYS.CW20_BALANCE,
      walletAddr,
      tokenAddr,
      mantleEndpoint,
      mantleFetch,
    ],
    queryFn as any,
    {
      refetchInterval: browserInactive && 1000 * 60 * 5,
      enabled: !browserInactive,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  return result as UseQueryResult<CW20Balance<T> | undefined>;
}
