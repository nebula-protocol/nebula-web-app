import { useApp } from '@libs/app-provider';
import { createQueryFn } from '@libs/react-query-utils';
import {
  NebulaContants,
  NebulaContractAddress,
  StakingRewardInfo,
  stakingRewardInfoQuery,
} from '@nebula-js/app-fns';
import { CW20Addr } from '@nebula-js/types';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useQuery, UseQueryResult } from 'react-query';
import { NEBULA_QUERY_KEYS } from '../../env';

const queryFn = createQueryFn(stakingRewardInfoQuery);

export function useStakingRewardInfoQuery(
  tokenAddr?: CW20Addr | undefined,
): UseQueryResult<StakingRewardInfo | undefined> {
  const connectedWallet = useConnectedWallet();

  const { wasmClient, queryErrorReporter, contractAddress } = useApp<
    NebulaContractAddress,
    NebulaContants
  >();

  //const {
  //  contractAddress: { staking },
  //} = useNebulaWebapp();
  //
  //const { browserInactive } = useBrowserInactive();

  const result = useQuery(
    [
      NEBULA_QUERY_KEYS.STAKING_REWARD_INFO,
      connectedWallet?.walletAddress,
      contractAddress.staking,
      tokenAddr,
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
