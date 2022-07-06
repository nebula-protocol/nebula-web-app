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
  if (network.chainID.startsWith('pisco')) {
    // testnet
    return {
      airdrop:
        'terra1rhs58clvfu4u2rln9zkzy8eqktgqncz2cjlsfg0yncztr7gg7xes38a48p' as HumanAddr,
      collector:
        'terra1tgncw05h4lkpmq2dl5uvdyx59sct6sznfekxhgss58c6mz0ewcnskcspzh' as HumanAddr,
      community:
        'terra1jspesqdct9xyr0chh5dlg74dawyw7fvsml3exn0nw87dp6m93llsl70628' as HumanAddr,
      clusterFactory:
        'terra1auws6l5d0ymnvyms7duplmt5ypgfe9ts0xwp5sejluj3psq5fu4s7tlju9' as HumanAddr,
      gov: 'terra10cnntj9v6hesltls5024shklzepf0hacgk9ht92letwzqgvp3xus4tldjn' as HumanAddr,
      incentives:
        'terra1f8dtwjysnzr9qxakzlug73v4supf7zq7nzc3hafdmz5ydg9hmw7qunvw29' as HumanAddr,
      incentivesCustody:
        'terra1gkzhedtwzfu766xxepsmvtzchd8uqhdw3re79g33y4t6mtgvewws2ppf5g' as HumanAddr,
      staking:
        'terra1emx8mruf5cpvc6p3rt3s29g8t0tszhtj3kqa6zf9tk3hwt7fxtdszh7xeq' as HumanAddr,
      oracle:
        'terra1tfuz74wqt9uuyfpwlt5s4awm3q6cuqxrsgx4t69epqqnu6je4vfshmxkuv' as HumanAddr,
      oracleHub:
        'terra1umxshy9lymmseygh2f4ymztehqltl2cmvwdy7zlwuz6u4uvhehjsyf9arf' as HumanAddr,
      terraswap: {
        factory:
          'terra1z3y69xas85r7egusa0c7m5sam0yk97gsztqmh8f2cc6rr4s4anysudp7k0' as HumanAddr,
        nebUstPair:
          'terra1auf5h6xjq04t8tqqm5mm34cjrjhvme0k66xp3l97m7m2gcef2xgss07mj5' as HumanAddr,
      },
      cw20: {
        NEB: 'terra103g6fdulfjl2vqc6xgme73q40syu2huw8ustpy9xg674a67sqavq62h54m' as CW20Addr,
        aUST: 'terra1hzh9vpxhsk8253se0vv5jj6etdvxu3nv8z07zu' as CW20Addr, // remove
      },
      anchor: {
        proxy: 'terra1hhgrnyq3gl78aqwn6hw2p0dena0lrkuq9ndfuu' as HumanAddr, // remove
        market: 'terra1sepfj7s0aeg5967uxnfk4thzlerrsktkpelm5s' as HumanAddr, // remove
      },
    };
  } else {
    throw new Error('please connect to pisco-1 testnet');

    // mainnet
    // return {
    //   airdrop: 'terra1wjqsy2q3xzn3rxv5drutfysvg24pqwsg3nmv0y' as HumanAddr,
    //   collector: 'terra17l6pueq2hpz7hwvr8hqa8qmslz8ddy530eaelp' as HumanAddr,
    //   community: 'terra1g5py2hu8kpenqetv6xjas5z5gtaszhsuk8yn7n' as HumanAddr,
    //   clusterFactory:
    //     'terra13uk55nt7d7telqluzhajv8u3n3vl5vuwjzcssr' as HumanAddr,
    //   gov: 'terra1gsq7p9a8uu6wdr78rk9cthz57tzkfzrejhdknf' as HumanAddr,
    //   incentives: 'terra14j6zzqyhlp06xrkzkuwngrfeprh5uyfj7jme7f' as HumanAddr,
    //   incentivesCustody:
    //     'terra1daqjhk38z0qd8vjuvg7lxrx2yr5l3c038lsgcm' as HumanAddr,
    //   staking: 'terra16rpqhxd7ju29jw8qe5gj2uxccj927d5993fkgk' as HumanAddr,
    //   oracle: 'terra1wxa08mnu0qry6h9t2m3dhrw4thhxdrwpyg3m7p' as HumanAddr,
    //   terraswap: {
    //     factory: 'terra1fnywlw4edny3vw44x04xd67uzkdqluymgreu7g' as HumanAddr,
    //     nebUstPair: 'terra1d7028vhd9u26fqyreee38cj39fwqvcyjps8sjk' as HumanAddr,
    //   },
    //   cw20: {
    //     NEB: 'terra1mpq5zkkm39nmjrjg9raknpfrfmcfwv0nh0whvn' as CW20Addr,
    //     aUST: 'terra1hzh9vpxhsk8253se0vv5jj6etdvxu3nv8z07zu' as CW20Addr,
    //   },
    //   anchor: {
    //     proxy: 'terra1hhgrnyq3gl78aqwn6hw2p0dena0lrkuq9ndfuu' as HumanAddr,
    //     market: 'terra1sepfj7s0aeg5967uxnfk4thzlerrsktkpelm5s' as HumanAddr,
    //   },
    // };
  }
}

export function NEBULA_CONSTANTS(network: NetworkInfo): NebulaContants {
  return {
    gasWanted: 1_300_000 as Gas,
    fixedGas: 1_671_053 as Gas,
    blocksPerYear: 4_656_810,
    gasAdjustment: 1.6 as Rate<number>,
    govGas: 450_000 as Gas,
    swapGasWantedPerAsset: 600_000 as Gas,
    airdropGasWanted: 300_000 as Gas,
    airdropGas: 334_211 as Gas,
    nebula: {
      clusterFee: {
        default: {
          txFeeBase: 10_000_000 as Gas,
          txFeePerInventory: 800_000 as Gas,
          txFeePerAsset: 400_000 as Gas,
          gasWantedBase: 10_000_000 as Gas,
          gasWantedPerInventory: 600_000 as Gas,
          gasWantedPerAsset: 300_000 as Gas,
        },
        arbMint: {
          txFeeBase: 10_000_000 as Gas,
          txFeePerInventory: 500_000 as Gas,
          txFeePerAsset: 300_000 as Gas,
          gasWantedBase: 10_000_000 as Gas,
          gasWantedPerInventory: 400_000 as Gas,
          gasWantedPerAsset: 200_000 as Gas,
        },
        arbRedeem: {
          txFeeBase: 10_000_000 as Gas,
          txFeePerInventory: 500_000 as Gas,
          txFeePerAsset: 300_000 as Gas,
          gasWantedBase: 10_000_000 as Gas,
          gasWantedPerInventory: 400_000 as Gas,
          gasWantedPerAsset: 200_000 as Gas,
        },
      },
    },
  };
}

export const ON_PRODUCTION = global.location.host === 'app.neb.money';

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
