import { NetworkInfo } from '@terra-money/use-wallet';
import { defaultLcdFetcher, LcdQueryClient } from '@libs/query-client';

export function NEBULA_DEFAULT_LCD_WASM_CLIENT(
  network: NetworkInfo,
): LcdQueryClient {
  const headers = new Headers();
  headers.append('cache-control', 'no-cache');

  console.log('current network lcd', network.lcd);

  return {
    // lcdEndpoint: network.lcd,
    lcdEndpoint: network.chainID.startsWith('bombay')
      ? network.lcd
      : 'https://load-balancer.neb.money',
    lcdFetcher: defaultLcdFetcher,
    requestInit: {
      headers,
    },
  };
}

export enum NEBULA_TX_KEYS {
  CLUSTER_MULTI_BUY = 'NEBULA_TX_CLUSTER_MULTI_BUY',
  CLUSTER_MINT = 'NEBULA_TX_CLUSTER_MINT',
  CLUSTER_ARB_MINT = 'NEBULA_TX_CLUSTER_ARB_MINT',
  CLUSTER_REDEEM = 'NEBULA_TX_CLUSTER_REDEEM',
  CLUSTER_ARB_REDEEM = 'NEBULA_TX_CLUSTER_ARB_REDEEM',
  STAKING_STAKE = 'NEBULA_TX_STAKING_STAKE',
  STAKING_UNSTAKE = 'NEBULA_TX_STAKING_UNSTAKE',
  GOV_STAKE = 'NEBULA_TX_GOV_STAKE',
  GOV_UNSTAKE = 'NEBULA_TX_GOV_UNSTAKE',
  GOV_CREATE_POLL = 'NEBULA_TX_GOV_CREATE_POLL',
  GOV_VOTE = 'NEBULA_TX_GOV_VOTE',
  GOV_CLAIM_REWARD = 'NEBULA_TX_GOV_CLAIM_REWARD',
  GOV_RESTAKE_REWARD = 'NEBULA_TX_GOV_RESTAKE_REWARD',
  CLAIM_ALL_REWARDS = 'NEBULA_TX_CLAIM_ALL_REWARDS',
  CLAIM_INCENTIVE_REWARD = 'NEBULA_TX_CLAIM_INCENTIVE_REWARD',
  AIRDROP_CLAIM = 'NEBULA_TX_AIRDROP_CLAIM',
}

export enum NEBULA_QUERY_KEYS {
  CLUSTER_FACTORY_CONFIG = 'NEBULA_QUERY_CLUSTER_FACTORY_CONFIG',
  CLUSTERS_LIST = 'NEBULA_QUERY_CLUSTERS_LIST',
  CLUSTERS_STATE_LIST = 'NEBULA_QUERY_CLUSTERS_STATE_LIST',
  CLUSTER_INFO = 'NEBULA_QUERY_CLUSTER_INFO',
  STAKING_POOL_INFO_LIST = 'NEBULA_QUERY_STAKING_CLUSTER_POOL_INFO_LIST',
  STAKING_REWARD_INFO = 'NEBULA_QUERY_STAKING_REWARD_INFO',
  GOV_STAKER = 'NEBULA_QUERY_GOV_STAKER',
  GOV_STATE = 'NEBULA_QUERY_GOV_STATE',
  GOV_CONFIG = 'NEBULA_QUERY_GOV_CONFIG',
  COMMUNITY_CONFIG = 'NEBULA_QUERY_COMMUNITY_CONFIG',
  GOV_POLLS = 'NEBULA_QUERY_GOV_POLLS',
  GOV_POLL = 'NEBULA_QUERY_GOV_POLL',
  GOV_VOTERS = 'NEBULA_QUERY_GOV_VOTERS',
  GOV_MY_POLLS = 'NEBULA_QUERY_GOV_MY_POLLS',
  GOV_VOTING_POWER = 'NEBULA_QUERY_GOV_VOTING_POWER',
  MYPAGE_HOLDINGS = 'NEBULA_QUERY_MYPAGE_HOLDINGS',
  MYPAGE_STAKING = 'NEBULA_QUERY_MYPAGE_STAKING',
  INCENTIVE_REWARD = 'NEBULA_QUERY_INCENTIVE_REWARD',
  AIRDROP_CHECK = 'NEBULA_AIRDROP_CHECK',
}
