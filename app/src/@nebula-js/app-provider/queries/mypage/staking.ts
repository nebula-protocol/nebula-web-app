import { useApp } from '@libs/app-provider';
import { createQueryFn } from '@libs/react-query-utils';
import {
  MypageStaking,
  mypageStakingQuery,
  NebulaContants,
  NebulaContractAddress,
} from '@nebula-js/app-fns';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useQuery, UseQueryResult } from 'react-query';
import { NEBULA_QUERY_KEYS } from '../../env';

const queryFn = createQueryFn(mypageStakingQuery);

export function useMypageStakingQuery(): UseQueryResult<
  MypageStaking | undefined
> {
  const connectedWallet = useConnectedWallet();

  const { wasmClient, queryErrorReporter, contractAddress } = useApp<
    NebulaContractAddress,
    NebulaContants
  >();

  const result = useQuery(
    [
      NEBULA_QUERY_KEYS.MYPAGE_STAKING,
      connectedWallet?.walletAddress,
      contractAddress.staking,
      contractAddress.terraswap.factory,
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