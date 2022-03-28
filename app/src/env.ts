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
      airdrop: 'terra16l476zxmduaxgpask2vqxut0674paz7mmdjhcw' as HumanAddr,
      collector: 'terra1nqjfk3uaefzrgecnmxjgcwxxfg4jhrvcupm9nm' as HumanAddr,
      community: 'terra12ptkvvhtyplqdqft3k7qf5e883q3v08p7edv94' as HumanAddr,
      clusterFactory:
        'terra103srr94gy8zgyey7ncg63gqfgac3y6nkdc28jh' as HumanAddr,
      gov: 'terra1yzsxytzktj7dsrhyajx34jzz8cxw0vws8cgvkg' as HumanAddr,
      incentives: 'terra1x7ug3ehdtdz5w2q37l2l9rd0u5ekv2gvzfq0y6' as HumanAddr,
      incentivesCustody:
        'terra1nghgqatgz3w2qps598zaf07526l7ye0g0pswz2' as HumanAddr,
      staking: 'terra1wqc6rek55dnpj2j2h6mc9kqpqxnwnt23l830ey' as HumanAddr,
      oracle: 'terra18syqrhamudfnks205wv8rrudp0yey7jk5kte97' as HumanAddr,
      terraswap: {
        factory: 'terra15jsahkaf9p0qu8ye873p0u5z6g07wdad0tdq43' as HumanAddr,
        nebUstPair: 'terra1u6tn733n3hw2gzkhqmqurajxjggfvf45qujq3d' as HumanAddr,
      },
      cw20: {
        NEB: 'terra1aj5yepjnmhdvh0xz3dfqeh30wday6tapvaze47' as CW20Addr,
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
