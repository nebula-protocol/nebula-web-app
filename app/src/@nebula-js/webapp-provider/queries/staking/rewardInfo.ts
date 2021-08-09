import { CW20Addr } from '@nebula-js/types';
import {
  StakingRewardInfo,
  stakingRewardInfoQuery,
} from '@nebula-js/webapp-fns';
import { NEBULA_QUERY_KEYS } from '@nebula-js/webapp-provider/env';
import { createQueryFn } from '@terra-dev/react-query-utils';
import { useBrowserInactive } from '@terra-dev/use-browser-inactive';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useTerraWebapp } from '@terra-money/webapp-provider';
import { useQuery, UseQueryResult } from 'react-query';
import { useNebulaWebapp } from '../../contexts/webapp';

const queryFn = createQueryFn(stakingRewardInfoQuery);

export function useStakingRewardInfoQuery(
  clusterToken?: CW20Addr | undefined,
): UseQueryResult<StakingRewardInfo | undefined> {
  const connectedWallet = useConnectedWallet();

  const { mantleFetch, mantleEndpoint, queryErrorReporter } = useTerraWebapp();

  const {
    contractAddress: { staking },
  } = useNebulaWebapp();

  const { browserInactive } = useBrowserInactive();

  const result = useQuery(
    [
      NEBULA_QUERY_KEYS.STAKING_REWARD_INFO,
      connectedWallet?.walletAddress,
      staking,
      clusterToken,
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
