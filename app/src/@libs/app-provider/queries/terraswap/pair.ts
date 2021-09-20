import { TerraswapPair, terraswapPairQuery } from '@libs/app-fns';
import { useApp } from '@libs/app-provider/contexts/app';
import { TERRA_QUERY_KEY } from '@libs/app-provider/env';
import { createQueryFn } from '@libs/react-query-utils';
import { terraswap } from '@libs/types';
import { useBrowserInactive } from '@libs/use-browser-inactive';
import { useQuery, UseQueryResult } from 'react-query';

const queryFn = createQueryFn(terraswapPairQuery);

export function useTerraswapPairQuery(
  assetInfos: [terraswap.AssetInfo, terraswap.AssetInfo],
): UseQueryResult<TerraswapPair | undefined> {
  const { mantleFetch, mantleEndpoint, queryErrorReporter, contractAddress } =
    useApp();

  const { browserInactive } = useBrowserInactive();

  const result = useQuery(
    [
      TERRA_QUERY_KEY.TERRASWAP_PAIR,
      contractAddress.terraswap.factory,
      assetInfos,
      mantleEndpoint,
      mantleFetch,
    ],
    queryFn,
    {
      refetchInterval: browserInactive && 1000 * 60 * 5,
      enabled: !browserInactive,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  return result;
}
