import { createQueryFn } from '@libs/react-query-utils';
import { MypageHoldings, mypageHoldingsQuery } from '@nebula-js/app-fns';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useQuery, UseQueryResult } from 'react-query';
import { NEBULA_QUERY_KEYS } from '../../env';
import { useNebulaApp } from '../../hooks/useNebulaApp';

const queryFn = createQueryFn(mypageHoldingsQuery);

export function useMypageHoldingsQuery(): UseQueryResult<
  MypageHoldings | undefined
> {
  const connectedWallet = useConnectedWallet();

  const { wasmClient, queryErrorReporter, contractAddress } = useNebulaApp();

  const result = useQuery(
    [
      NEBULA_QUERY_KEYS.MYPAGE_HOLDINGS,
      connectedWallet?.walletAddress,
      contractAddress.cw20.NEB,
      contractAddress.terraswap.factory,
      contractAddress.clusterFactory,
      wasmClient,
    ],
    queryFn,
    {
      refetchInterval: 1000 * 60 * 5,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  return result;
}
