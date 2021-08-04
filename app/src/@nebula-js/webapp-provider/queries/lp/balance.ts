import { HumanAddr } from '@nebula-js/types';
import { LpBalance, lpBalanceQuery } from '@nebula-js/webapp-fns';
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
    lpAddr: HumanAddr,
  ) => {
    return walletAddr
      ? lpBalanceQuery({
          mantleEndpoint,
          mantleFetch,
          walletAddress: walletAddr,
          wasmQuery: {
            minter: {
              contractAddress: lpAddr,
              query: {
                minter: {},
              },
            },
          },
        })
      : Promise.resolve(undefined);
  },
);

export function useLpBalanceQuery(
  lpAddr: HumanAddr,
  walletAddr: HumanAddr | undefined,
): UseQueryResult<LpBalance | undefined> {
  const { mantleFetch, mantleEndpoint, queryErrorReporter } = useTerraWebapp();

  const { browserInactive } = useBrowserInactive();

  const result = useQuery(
    [
      NEBULA_QUERY_KEYS.CW20_BALANCE,
      mantleEndpoint,
      mantleFetch,
      walletAddr,
      lpAddr,
    ],
    queryFn,
    {
      refetchInterval: browserInactive && 1000 * 60 * 5,
      enabled: !browserInactive,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  return result as UseQueryResult<LpBalance | undefined>;
}
