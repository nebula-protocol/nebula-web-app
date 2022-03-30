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
      airdrop: 'terra1850ekmp6nlhsfvqp3xpqppcrwf79c7n9se0qvd' as HumanAddr,
      collector: 'terra1de40ha6rvjvr2wega20zq8s6cykqg5p32nvn6m' as HumanAddr,
      community: 'terra1q7q84rezj8fdmyfdhy99rkv6gsqyr0aa6qprgv' as HumanAddr,
      clusterFactory:
        'terra1rmluusw24whnakak0zvf6mczhspn365v8vfpfd' as HumanAddr,
      gov: 'terra1lkcqde5sz4qhnrv8l53fhn4w60qpx85ca93f8a' as HumanAddr,
      incentives: 'terra166nc3wrd8gnhdg0swx82nh47y680x7dfjr6rql' as HumanAddr,
      incentivesCustody:
        'terra13zpnlq56qk3lczsg9gg774tmedk390dd6f42n5' as HumanAddr,
      staking: 'terra1q7vydz2r4hm0rxr55jnkqw0946exeqkh4gjqkz' as HumanAddr,
      oracle: 'terra1ntralwz67qraqwz2guk8sr4ey40mtr2pshvh5l' as HumanAddr,
      terraswap: {
        factory: 'terra15jsahkaf9p0qu8ye873p0u5z6g07wdad0tdq43' as HumanAddr,
        nebUstPair: 'terra15z87yd2d02l9p393a2uc5anyrxs2dvrpdmswhm' as HumanAddr,
      },
      cw20: {
        NEB: 'terra1ztm0tt4eaeq9j0rgeehh05vejsjmfylq827hq7' as CW20Addr,
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
