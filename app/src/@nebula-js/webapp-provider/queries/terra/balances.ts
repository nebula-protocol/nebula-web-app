import { HumanAddr, terraswap, Token, u } from '@nebula-js/types';
import { TerraBalances, terraBalancesQuery } from '@nebula-js/webapp-fns';
import { createQueryFn } from '@terra-dev/react-query-utils';
import { useBrowserInactive } from '@terra-dev/use-browser-inactive';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { MantleFetch, useTerraWebapp } from '@terra-money/webapp-provider';
import { useQuery, UseQueryResult } from 'react-query';
import { NEBULA_QUERY_KEYS } from '../../env';

const queryFn = createQueryFn(
  (
    mantleEndpoint: string,
    mantleFetch: MantleFetch,
    walletAddr: HumanAddr | undefined,
    assets: terraswap.AssetInfo[],
  ) => {
    if (walletAddr) {
      return terraBalancesQuery({
        mantleEndpoint,
        mantleFetch,
        walletAddress: walletAddr,
        assets,
      });
    }

    const balances = assets.map((asset) => ({
      asset,
      balance: '0' as u<Token>,
    }));

    const balancesIndex = new Map<terraswap.AssetInfo, u<Token>>();

    for (const { asset, balance } of balances) {
      balancesIndex.set(asset, balance);
    }

    return Promise.resolve({ balances, balancesIndex });
  },
);

export function useTerraBalancesQuery(
  assets: terraswap.AssetInfo[],
): UseQueryResult<TerraBalances | undefined> {
  const { mantleFetch, mantleEndpoint, queryErrorReporter } = useTerraWebapp();

  const connectedWallet = useConnectedWallet();

  const { browserInactive } = useBrowserInactive();

  const result = useQuery(
    [
      NEBULA_QUERY_KEYS.CW20_BALANCE,
      mantleEndpoint,
      mantleFetch,
      connectedWallet?.walletAddress,
      assets,
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
