import { terraswap } from '@nebula-js/types';
import { TerraBalances, terraBalancesQuery } from '@nebula-js/webapp-fns';
import { createQueryFn } from '@packages/react-query-utils';
import { useBrowserInactive } from '@packages/use-browser-inactive';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useTerraWebapp } from '@packages/webapp-provider';
import { useQuery, UseQueryResult } from 'react-query';
import { NEBULA_QUERY_KEYS } from '../../env';

const queryFn = createQueryFn(terraBalancesQuery);

export function useTerraBalancesQuery(
  assets: terraswap.AssetInfo[],
): UseQueryResult<TerraBalances | undefined> {
  const { mantleFetch, mantleEndpoint, queryErrorReporter } = useTerraWebapp();

  const connectedWallet = useConnectedWallet();

  const { browserInactive } = useBrowserInactive();

  const result = useQuery(
    [
      NEBULA_QUERY_KEYS.CW20_BALANCE,
      connectedWallet?.walletAddress,
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
