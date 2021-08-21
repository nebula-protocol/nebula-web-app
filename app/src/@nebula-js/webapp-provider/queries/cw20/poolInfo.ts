import { CW20Addr, Token } from '@nebula-js/types';
import { CW20PoolInfo, cw20PoolInfoQuery } from '@nebula-js/webapp-fns';
import { createQueryFn } from '@packages/react-query-utils';
import { useBrowserInactive } from '@packages/use-browser-inactive';
import { useTerraWebapp } from '@packages/webapp-provider';
import { useQuery, UseQueryResult } from 'react-query';
import { useNebulaWebapp } from '../../contexts/webapp';
import { NEBULA_QUERY_KEYS } from '../../env';

const queryFn = createQueryFn(cw20PoolInfoQuery);

export function useCW20PoolInfoQuery<T extends Token>(
  tokenAddr: CW20Addr,
): UseQueryResult<CW20PoolInfo<T> | undefined> {
  const { mantleFetch, mantleEndpoint, queryErrorReporter } = useTerraWebapp();

  const {
    contractAddress: { terraswap },
  } = useNebulaWebapp();

  const { browserInactive } = useBrowserInactive();

  const result = useQuery(
    [
      NEBULA_QUERY_KEYS.STAKING_POOL_INFO,
      tokenAddr,
      terraswap.factory,
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

  return result as UseQueryResult<CW20PoolInfo<T>>;
}
