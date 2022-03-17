import { Airdrop, airdropCheckQuery } from '@nebula-js/app-fns';
import { EMPTY_QUERY_RESULT } from '@libs/app-provider';
import { createQueryFn } from '@libs/react-query-utils';
import { useConnectedWallet, useWallet } from '@terra-money/wallet-provider';
import { useQuery, UseQueryResult } from 'react-query';
import { useNebulaApp } from '@nebula-js/app-provider';
import { NEBULA_QUERY_KEYS } from '../../env';
import { airdropCache } from '@nebula-js/app-fns';

const queryFn = createQueryFn(airdropCheckQuery);

export function useAirdropCheckQuery(): UseQueryResult<Airdrop | undefined> {
  const { queryClient, contractAddress, queryErrorReporter } = useNebulaApp();

  const connectedWallet = useConnectedWallet();

  const { network } = useWallet();

  const result = useQuery(
    [
      NEBULA_QUERY_KEYS.AIRDROP_CHECK,
      connectedWallet?.walletAddress,
      contractAddress.airdrop,
      network.chainID,
      queryClient,
    ],
    queryFn,
    {
      enabled: !!connectedWallet,
      keepPreviousData: false,
      onError: queryErrorReporter,
    },
  );

  return connectedWallet &&
    !(airdropCache.get(connectedWallet.walletAddress) ?? false) &&
    result.data
    ? result
    : EMPTY_QUERY_RESULT;
}
