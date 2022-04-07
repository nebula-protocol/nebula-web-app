import { TERRA_QUERY_KEY, TERRA_TX_KEYS } from '@libs/app-provider';
import { CW20Addr, Gas, HumanAddr, Rate } from '@libs/types';
import {
  NEBULA_QUERY_KEYS,
  NEBULA_TX_KEYS,
  NebulaContants,
  NebulaContractAddress,
} from '@nebula-js/app-provider';
import { NetworkInfo } from '@terra-money/use-wallet';

export function NEBULA_DEFAULT_WASM_CLIENT(
  network: NetworkInfo,
): 'lcd' | 'hive' {
  return 'lcd';
  //return network.chainID.startsWith('testnet') ? 'hive' : 'lcd';
}

export function NEBULA_CONTRACT_ADDRESS(
  network: NetworkInfo,
): NebulaContractAddress {
  if (network.chainID.startsWith('bombay')) {
    return {
      airdrop: 'terra1ccxk2lfyr59uwyuqndfl4k7vnjvxqy3chku9g5' as HumanAddr,
      collector: 'terra1dxj5exufmmcypu5m3nu5aj8huerv86luy36xmu' as HumanAddr,
      community: 'terra1hnszn4rmllu2gmjvtul3qz555r6ysmsarwxhmf' as HumanAddr,
      clusterFactory:
        'terra16g6l6w9d2p862v8f4mda0a0zsn8xe55834dgsc' as HumanAddr,
      gov: 'terra1m28kqh03exl8nhvw9k6efhedn6ghcvfkghey0l' as HumanAddr,
      incentives: 'terra18aapzlvk3g4x7etqqngvdxlc3k9e7slynd3zk6' as HumanAddr,
      incentivesCustody:
        'terra1xzf5r2ftuj2zjcp0r7szdp29f9242g7qtajat6' as HumanAddr,
      staking: 'terra1277gqnvqs95h8v908m3fzsayamajgz53n39q9l' as HumanAddr,
      oracle: 'terra13cs729swd0e2mre5a0f0wa77r3vfsa70nekm7n' as HumanAddr,
      terraswap: {
        factory: 'terra15jsahkaf9p0qu8ye873p0u5z6g07wdad0tdq43' as HumanAddr,
        nebUstPair: 'terra1al32z353z63d6ejr2603lecc0jzqf30jegwqry' as HumanAddr,
      },
      cw20: {
        NEB: 'terra1gam4r7le3j9rkssqsgdkyltqtlgwkyuww7e0gp' as CW20Addr,
        aUST: 'terra1ajt556dpzvjwl0kl5tzku3fc3p3knkg9mkv8jl' as CW20Addr,
      },
      anchor: {
        proxy: 'terra1jqx7xrt6fgf9qa48e9h0cvg6yvhtn4mcfsgqsz' as HumanAddr,
        market: 'terra15dwd5mj8v59wpj0wvt233mf5efdff808c5tkal' as HumanAddr,
      },
    };
  }

  throw new Error(`currently only support "bombay-12"`);
}

export function NEBULA_CONSTANTS(network: NetworkInfo): NebulaContants {
  if (network.chainID.startsWith('bombay')) {
    return {
      gasWanted: 1_000_000 as Gas,
      fixedGas: 1_671_053 as Gas,
      blocksPerYear: 4_656_810,
      gasAdjustment: 1.6 as Rate<number>,
      govGas: 500_000 as Gas,
      swapGasWantedPerAsset: 600_000 as Gas,
      airdropGasWanted: 300_000 as Gas,
      airdropGas: 334_211 as Gas,
      nebula: {
        clusterFee: {
          default: {
            txFeeBase: 7_000_000 as Gas,
            txFeePerInventory: 600_000 as Gas,
            txFeePerAsset: 400_000 as Gas,
            gasWantedBase: 7_000_000 as Gas,
            gasWantedPerInventory: 400_000 as Gas,
            gasWantedPerAsset: 300_000 as Gas,
          },
          arbMint: {
            txFeeBase: 15_000_000 as Gas,
            txFeePerInventory: 800_000 as Gas,
            txFeePerAsset: 400_000 as Gas,
            gasWantedBase: 15_000_000 as Gas,
            gasWantedPerInventory: 600_000 as Gas,
            gasWantedPerAsset: 300_000 as Gas,
          },
          arbRedeem: {
            txFeeBase: 15_000_000 as Gas,
            txFeePerInventory: 800_000 as Gas,
            txFeePerAsset: 400_000 as Gas,
            gasWantedBase: 15_000_000 as Gas,
            gasWantedPerInventory: 600_000 as Gas,
            gasWantedPerAsset: 300_000 as Gas,
          },
        },
      },
    };
  }

  throw new Error(`currently only support "bombay-12"`);
}

export const ON_PRODUCTION = global.location.host === 'app.nebulaprotocol.com';

export const WALLETCONNECT_BRIDGE_SERVER = 'https://walletconnect.terra.dev/';

export const NEBULA_TX_REFETCH_MAP = {
  [TERRA_TX_KEYS.CW20_BUY]: [
    TERRA_QUERY_KEY.TOKEN_BALANCES,
    TERRA_QUERY_KEY.CW20_BALANCE,
    TERRA_QUERY_KEY.TERRA_BALANCES,
    TERRA_QUERY_KEY.TERRA_NATIVE_BALANCES,
  ],
  [TERRA_TX_KEYS.CW20_SELL]: [
    TERRA_QUERY_KEY.TOKEN_BALANCES,
    TERRA_QUERY_KEY.CW20_BALANCE,
    TERRA_QUERY_KEY.TERRA_BALANCES,
    TERRA_QUERY_KEY.TERRA_NATIVE_BALANCES,
  ],
  [TERRA_TX_KEYS.SEND]: [
    TERRA_QUERY_KEY.TOKEN_BALANCES,
    TERRA_QUERY_KEY.CW20_BALANCE,
    TERRA_QUERY_KEY.TERRA_BALANCES,
    TERRA_QUERY_KEY.TERRA_NATIVE_BALANCES,
  ],
  [NEBULA_TX_KEYS.CLUSTER_MULTI_BUY]: [
    TERRA_QUERY_KEY.TOKEN_BALANCES,
    TERRA_QUERY_KEY.CW20_BALANCE,
    TERRA_QUERY_KEY.TERRA_BALANCES,
    TERRA_QUERY_KEY.TERRA_NATIVE_BALANCES,
  ],
  [NEBULA_TX_KEYS.CLUSTER_MINT]: [
    TERRA_QUERY_KEY.TOKEN_BALANCES,
    TERRA_QUERY_KEY.CW20_BALANCE,
    TERRA_QUERY_KEY.TERRA_BALANCES,
    TERRA_QUERY_KEY.TERRA_NATIVE_BALANCES,
    NEBULA_QUERY_KEYS.CLUSTER_INFO,
  ],
  [NEBULA_TX_KEYS.CLUSTER_ARB_MINT]: [
    TERRA_QUERY_KEY.TOKEN_BALANCES,
    TERRA_QUERY_KEY.CW20_BALANCE,
    TERRA_QUERY_KEY.TERRA_BALANCES,
    TERRA_QUERY_KEY.TERRA_NATIVE_BALANCES,
    NEBULA_QUERY_KEYS.CLUSTER_INFO,
  ],
  [NEBULA_TX_KEYS.CLUSTER_REDEEM]: [
    TERRA_QUERY_KEY.TOKEN_BALANCES,
    TERRA_QUERY_KEY.CW20_BALANCE,
    TERRA_QUERY_KEY.TERRA_BALANCES,
    TERRA_QUERY_KEY.TERRA_NATIVE_BALANCES,
    NEBULA_QUERY_KEYS.CLUSTER_INFO,
  ],
  [NEBULA_TX_KEYS.CLUSTER_ARB_REDEEM]: [
    TERRA_QUERY_KEY.TOKEN_BALANCES,
    TERRA_QUERY_KEY.CW20_BALANCE,
    TERRA_QUERY_KEY.TERRA_BALANCES,
    TERRA_QUERY_KEY.TERRA_NATIVE_BALANCES,
    NEBULA_QUERY_KEYS.CLUSTER_INFO,
  ],
  [NEBULA_TX_KEYS.STAKING_STAKE]: [
    TERRA_QUERY_KEY.TOKEN_BALANCES,
    TERRA_QUERY_KEY.CW20_BALANCE,
    TERRA_QUERY_KEY.TERRA_BALANCES,
    TERRA_QUERY_KEY.TERRA_NATIVE_BALANCES,
    NEBULA_QUERY_KEYS.STAKING_REWARD_INFO,
  ],
  [NEBULA_TX_KEYS.STAKING_UNSTAKE]: [
    TERRA_QUERY_KEY.TOKEN_BALANCES,
    TERRA_QUERY_KEY.CW20_BALANCE,
    TERRA_QUERY_KEY.TERRA_BALANCES,
    TERRA_QUERY_KEY.TERRA_NATIVE_BALANCES,
    NEBULA_QUERY_KEYS.STAKING_REWARD_INFO,
  ],
  [NEBULA_TX_KEYS.GOV_STAKE]: [
    TERRA_QUERY_KEY.TOKEN_BALANCES,
    TERRA_QUERY_KEY.CW20_BALANCE,
    TERRA_QUERY_KEY.TERRA_BALANCES,
    TERRA_QUERY_KEY.TERRA_NATIVE_BALANCES,
    TERRA_QUERY_KEY.CW20_TOKEN_INFO,
    NEBULA_QUERY_KEYS.GOV_STATE,
    NEBULA_QUERY_KEYS.GOV_STAKER,
  ],
  [NEBULA_TX_KEYS.GOV_UNSTAKE]: [
    TERRA_QUERY_KEY.TOKEN_BALANCES,
    TERRA_QUERY_KEY.CW20_BALANCE,
    TERRA_QUERY_KEY.TERRA_BALANCES,
    TERRA_QUERY_KEY.TERRA_NATIVE_BALANCES,
    TERRA_QUERY_KEY.CW20_TOKEN_INFO,
    NEBULA_QUERY_KEYS.GOV_STATE,
    NEBULA_QUERY_KEYS.GOV_STAKER,
  ],
  [NEBULA_TX_KEYS.GOV_CREATE_POLL]: [
    TERRA_QUERY_KEY.TOKEN_BALANCES,
    NEBULA_QUERY_KEYS.GOV_POLLS,
  ],
  [NEBULA_TX_KEYS.GOV_VOTE]: [
    TERRA_QUERY_KEY.TOKEN_BALANCES,
    NEBULA_QUERY_KEYS.GOV_POLL,
    NEBULA_QUERY_KEYS.GOV_VOTERS,
    NEBULA_QUERY_KEYS.GOV_STAKER,
  ],
  [NEBULA_TX_KEYS.GOV_CLAIM_REWARD]: [NEBULA_QUERY_KEYS.GOV_STAKER],
  [NEBULA_TX_KEYS.GOV_RESTAKE_REWARD]: [NEBULA_QUERY_KEYS.GOV_STAKER],
  [NEBULA_TX_KEYS.CLAIM_INCENTIVE_REWARD]: [
    TERRA_QUERY_KEY.TOKEN_BALANCES,
    TERRA_QUERY_KEY.CW20_BALANCE,
    TERRA_QUERY_KEY.TERRA_BALANCES,
    TERRA_QUERY_KEY.TERRA_NATIVE_BALANCES,
    NEBULA_QUERY_KEYS.INCENTIVE_REWARD,
  ],
  [NEBULA_TX_KEYS.CLAIM_ALL_REWARDS]: [
    TERRA_QUERY_KEY.TOKEN_BALANCES,
    TERRA_QUERY_KEY.CW20_BALANCE,
    TERRA_QUERY_KEY.TERRA_BALANCES,
    TERRA_QUERY_KEY.TERRA_NATIVE_BALANCES,
    TERRA_QUERY_KEY.CW20_TOKEN_INFO,
    NEBULA_QUERY_KEYS.MYPAGE_HOLDINGS,
    NEBULA_QUERY_KEYS.MYPAGE_STAKING,
    NEBULA_QUERY_KEYS.GOV_STAKER,
    NEBULA_QUERY_KEYS.INCENTIVE_REWARD,
  ],
  [NEBULA_TX_KEYS.AIRDROP_CLAIM]: [
    TERRA_QUERY_KEY.TOKEN_BALANCES,
    TERRA_QUERY_KEY.CW20_BALANCE,
    TERRA_QUERY_KEY.TERRA_BALANCES,
    TERRA_QUERY_KEY.TERRA_NATIVE_BALANCES,
    NEBULA_QUERY_KEYS.AIRDROP_CHECK,
  ],
};
