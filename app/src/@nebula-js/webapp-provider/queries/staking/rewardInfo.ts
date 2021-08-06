import { HumanAddr } from '@anchor-protocol/types';
import { CW20Addr } from '@nebula-js/types';
import {
  StakingRewardInfo,
  stakingRewardInfoQuery,
} from '@nebula-js/webapp-fns';
import { NEBULA_QUERY_KEYS } from '@nebula-js/webapp-provider/env';
import { createQueryFn } from '@terra-dev/react-query-utils';
import { useBrowserInactive } from '@terra-dev/use-browser-inactive';
import {
  ConnectedWallet,
  useConnectedWallet,
} from '@terra-money/wallet-provider';
import { MantleFetch, useTerraWebapp } from '@terra-money/webapp-provider';
import { useQuery, UseQueryResult } from 'react-query';
import { useNebulaWebapp } from '../../contexts/webapp';

const queryFn = createQueryFn(
  (
    mantleEndpoint: string,
    mantleFetch: MantleFetch,
    connectedWallet: ConnectedWallet | undefined,
    stakingAddr: HumanAddr,
    clusterToken: CW20Addr | undefined,
  ) => {
    return connectedWallet
      ? stakingRewardInfoQuery({
          mantleEndpoint,
          mantleFetch,
          wasmQuery: {
            rewardInfo: {
              contractAddress: stakingAddr,
              query: {
                reward_info: {
                  staker_addr: connectedWallet.walletAddress,
                  asset_token: clusterToken,
                },
              },
            },
          },
        })
      : Promise.resolve(undefined);
  },
);

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
      mantleEndpoint,
      mantleFetch,
      connectedWallet,
      staking,
      clusterToken,
    ],
    queryFn,
    {
      refetchInterval: browserInactive && 1000 * 60 * 5,
      enabled: !browserInactive,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  console.log(
    'rewardInfo.ts..useStakingRewardInfoQuery()',
    clusterToken,
    JSON.stringify(result.data, null, 2),
  );

  return result;
}
