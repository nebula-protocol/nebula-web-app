import {
  cw20BalanceQuery,
  CW20PoolInfo,
  cw20PoolInfoQuery,
} from '@libs/app-fns';
import { QueryClient } from '@libs/query-client';
import { cluster, cw20, CW20Addr, HumanAddr, Token, u } from '@nebula-js/types';
import { clusterStateListQuery } from '../clusters/stateList';

export type MypageHoldings = Array<
  CW20PoolInfo<Token> & {
    tokenBalance: cw20.BalanceResponse<Token>;
    clusterState?: cluster.ClusterStateResponse | undefined;
  }
>;

export async function mypageHoldingsQuery(
  walletAddr: HumanAddr | undefined,
  nebTokenAddr: CW20Addr,
  terraswapFactoryAddr: HumanAddr,
  clusterFactoryAddr: HumanAddr,
  queryClient: QueryClient,
): Promise<MypageHoldings> {
  if (!walletAddr) {
    return [];
  }

  const clusterStates = await clusterStateListQuery(
    clusterFactoryAddr,
    queryClient,
  );

  const tokenInfos: Array<
    [CW20Addr, cluster.ClusterStateResponse | undefined]
  > = [
    [nebTokenAddr, undefined],
    ...clusterStates.map(
      (clusterState) =>
        [clusterState.cluster_token, clusterState] as [
          CW20Addr,
          cluster.ClusterStateResponse,
        ],
    ),
  ];

  return await Promise.all(
    tokenInfos.map(([tokenAddr, clusterState]) => {
      return Promise.all([
        cw20PoolInfoQuery(tokenAddr, terraswapFactoryAddr, queryClient),
        cw20BalanceQuery(walletAddr, tokenAddr, queryClient),
      ]).then(([poolInfo, balance]) => ({
        ...poolInfo,
        clusterState,
        tokenBalance: balance?.tokenBalance ?? {
          balance: '0' as u<Token>,
        },
      }));
    }),
  );
}
