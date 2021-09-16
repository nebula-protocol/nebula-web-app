import { createQueryFn } from '@libs/react-query-utils';
import { HumanAddr, terraswap } from '@libs/types';
import { useBrowserInactive } from '@libs/use-browser-inactive';
import {
  TERRA_QUERY_KEY,
  TerraBalancesWithTokenInfo,
  terraBalancesWithTokenInfoQuery,
} from '@libs/app-fns';
import { useTerraWebapp } from '@libs/app-provider';
import { useConnectedWallet } from '@terra-dev/use-wallet';
import { useQuery, UseQueryResult } from 'react-query';

const queryFn = createQueryFn(terraBalancesWithTokenInfoQuery);

export function useTerraBalancesWithTokenInfoQuery(
  assets: terraswap.AssetInfo[],
  walletAddress?: HumanAddr,
): UseQueryResult<TerraBalancesWithTokenInfo | undefined> {
  const { mantleFetch, mantleEndpoint, queryErrorReporter } = useTerraWebapp();

  const connectedWallet = useConnectedWallet();

  const { browserInactive } = useBrowserInactive();

  const result = useQuery(
    [
      TERRA_QUERY_KEY.TERRA_BALANCES,
      walletAddress ?? connectedWallet?.walletAddress,
      assets,
      mantleEndpoint,
      mantleFetch,
    ],
    queryFn,
    {
      refetchInterval: !!connectedWallet && browserInactive && 1000 * 60 * 5,
      enabled: !browserInactive,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  return result;
}
