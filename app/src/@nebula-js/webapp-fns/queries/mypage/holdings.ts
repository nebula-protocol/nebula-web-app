import { defaultMantleFetch, MantleFetch } from '@libs/mantle';
import {
  cw20BalanceQuery,
  CW20PoolInfo,
  cw20PoolInfoQuery,
} from '@libs/webapp-fns';
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
  mantleEndpoint: string,
  mantleFetch: MantleFetch = defaultMantleFetch,
  requestInit?: RequestInit,
): Promise<MypageHoldings> {
  if (!walletAddr) {
    return [];
  }

  const clusterStates = await clusterStateListQuery(
    clusterFactoryAddr,
    mantleEndpoint,
    mantleFetch,
    requestInit,
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
        cw20PoolInfoQuery(
          tokenAddr,
          terraswapFactoryAddr,
          mantleEndpoint,
          mantleFetch,
          requestInit,
        ),
        cw20BalanceQuery(
          walletAddr,
          tokenAddr,
          mantleEndpoint,
          mantleFetch,
          requestInit,
        ),
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
