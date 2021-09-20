import { TerraswapPool, terraswapPoolQuery } from '@libs/app-fns';
import { useApp } from '@libs/app-provider/contexts/app';
import { TERRA_QUERY_KEY } from '@libs/app-provider/env';
import { createQueryFn } from '@libs/react-query-utils';
import { HumanAddr, Token } from '@libs/types';
import { useBrowserInactive } from '@libs/use-browser-inactive';
import { useQuery, UseQueryResult } from 'react-query';

const queryFn = createQueryFn(terraswapPoolQuery);

export function useTerraswapPoolQuery<T extends Token>(
  terraswapPairAddr: HumanAddr | undefined,
): UseQueryResult<TerraswapPool<T> | undefined> {
  const { mantleFetch, mantleEndpoint, queryErrorReporter } = useApp();

  const { browserInactive } = useBrowserInactive();

  const result = useQuery(
    [
      TERRA_QUERY_KEY.TERRASWAP_POOL,
      terraswapPairAddr,
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

  return result as UseQueryResult<TerraswapPool<T> | undefined>;
}
