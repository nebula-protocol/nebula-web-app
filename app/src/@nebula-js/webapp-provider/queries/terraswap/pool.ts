import { HumanAddr } from '@anchor-protocol/types';
import { Token } from '@nebula-js/types';
import { TerraswapPool, terraswapPoolQuery } from '@nebula-js/webapp-fns';
import { createQueryFn } from '@terra-dev/react-query-utils';
import { useBrowserInactive } from '@terra-dev/use-browser-inactive';
import { useTerraWebapp } from '@terra-money/webapp-provider';
import { useQuery, UseQueryResult } from 'react-query';
import { NEBULA_QUERY_KEYS } from '../../env';

const queryFn = createQueryFn(terraswapPoolQuery);

export function useTerraswapPoolQuery<T extends Token>(
  terraswapPairAddr: HumanAddr | undefined,
): UseQueryResult<TerraswapPool<T> | undefined> {
  const { mantleFetch, mantleEndpoint, queryErrorReporter } = useTerraWebapp();

  const { browserInactive } = useBrowserInactive();

  const result = useQuery(
    [
      NEBULA_QUERY_KEYS.TERRASWAP_POOL,
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
