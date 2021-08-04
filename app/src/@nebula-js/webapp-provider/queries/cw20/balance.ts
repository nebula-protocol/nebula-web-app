import { CW20Addr, HumanAddr, Token } from '@nebula-js/types';
import { CW20Balance, cw20BalanceQuery } from '@nebula-js/webapp-fns';
import { createQueryFn } from '@terra-dev/react-query-utils';
import { useBrowserInactive } from '@terra-dev/use-browser-inactive';
import { MantleFetch, useTerraWebapp } from '@terra-money/webapp-provider';
import { useQuery, UseQueryResult } from 'react-query';
import { NEBULA_QUERY_KEYS } from '../../env';

const queryFn = createQueryFn(
  (
    mantleEndpoint: string,
    mantleFetch: MantleFetch,
    walletAddr: HumanAddr | undefined,
    tokenAddr: CW20Addr,
  ) => {
    return walletAddr
      ? cw20BalanceQuery({
          mantleEndpoint,
          mantleFetch,
          wasmQuery: {
            tokenBalance: {
              contractAddress: tokenAddr,
              query: {
                balance: {
                  address: walletAddr,
                },
              },
            },
          },
        })
      : Promise.resolve(undefined);
  },
);

export function useCW20BalanceQuery<T extends Token>(
  tokenAddr: CW20Addr,
  walletAddr: HumanAddr | undefined,
): UseQueryResult<CW20Balance<T> | undefined> {
  const { mantleFetch, mantleEndpoint, queryErrorReporter } = useTerraWebapp();

  const { browserInactive } = useBrowserInactive();

  const result = useQuery(
    [
      NEBULA_QUERY_KEYS.CW20_BALANCE,
      mantleEndpoint,
      mantleFetch,
      walletAddr,
      tokenAddr,
    ],
    queryFn,
    {
      refetchInterval: browserInactive && 1000 * 60 * 5,
      enabled: !browserInactive,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  return result as UseQueryResult<CW20Balance<T> | undefined>;
}
