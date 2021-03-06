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
    // testnet
    return {
      airdrop: 'terra16l476zxmduaxgpask2vqxut0674paz7mmdjhcw' as HumanAddr,
      collector: 'terra193we3rf4sreh3j5ecw5dm58w835jcwle638zse' as HumanAddr,
      community: 'terra1wzqulhjxlz3xlq2h9kkgqzkmhuc9szf7knm0zq' as HumanAddr,
      clusterFactory:
        'terra13fznthg3jz5hgmy2k3fl3e736hmsaut9ylnhl2' as HumanAddr,
      gov: 'terra1mvv63f0aerqsj2rxlvqfqa9ng29tt9ftustsy8' as HumanAddr,
      incentives: 'terra1yquzgj5hrm7y40cfuk69smuc2swz95ewa4ra9a' as HumanAddr,
      incentivesCustody:
        'terra16vx25lx2n70fds5rr4c552t24jecxkm67t3mfr' as HumanAddr,
      staking: 'terra15s92ygxd8kpgpt8jmnl23nztvkhhytsrtzazuu' as HumanAddr,
      oracle: 'terra1ea2n3mlwveum0la900r9tlfs6qg8pdmn2cnd07' as HumanAddr,
      terraswap: {
        factory: 'terra15jsahkaf9p0qu8ye873p0u5z6g07wdad0tdq43' as HumanAddr,
        nebUstPair: 'terra1y05y2hyttrkr22hsqkfnjfvxgwms0rp2lvhgrq' as HumanAddr,
      },
      cw20: {
        NEB: 'terra1cv8ar4gld0v6ns3zs2kzws8tgdzje3y8ar8jxe' as CW20Addr,
        aUST: 'terra1ajt556dpzvjwl0kl5tzku3fc3p3knkg9mkv8jl' as CW20Addr,
      },
      anchor: {
        proxy: 'terra1jqx7xrt6fgf9qa48e9h0cvg6yvhtn4mcfsgqsz' as HumanAddr,
        market: 'terra15dwd5mj8v59wpj0wvt233mf5efdff808c5tkal' as HumanAddr,
      },
    };
  } else {
    // mainnet
    return {
      airdrop: 'terra1wjqsy2q3xzn3rxv5drutfysvg24pqwsg3nmv0y' as HumanAddr,
      collector: 'terra17l6pueq2hpz7hwvr8hqa8qmslz8ddy530eaelp' as HumanAddr,
      community: 'terra1g5py2hu8kpenqetv6xjas5z5gtaszhsuk8yn7n' as HumanAddr,
      clusterFactory:
        'terra13uk55nt7d7telqluzhajv8u3n3vl5vuwjzcssr' as HumanAddr,
      gov: 'terra1gsq7p9a8uu6wdr78rk9cthz57tzkfzrejhdknf' as HumanAddr,
      incentives: 'terra14j6zzqyhlp06xrkzkuwngrfeprh5uyfj7jme7f' as HumanAddr,
      incentivesCustody:
        'terra1daqjhk38z0qd8vjuvg7lxrx2yr5l3c038lsgcm' as HumanAddr,
      staking: 'terra16rpqhxd7ju29jw8qe5gj2uxccj927d5993fkgk' as HumanAddr,
      oracle: 'terra1wxa08mnu0qry6h9t2m3dhrw4thhxdrwpyg3m7p' as HumanAddr,
      terraswap: {
        factory: 'terra1fnywlw4edny3vw44x04xd67uzkdqluymgreu7g' as HumanAddr,
        nebUstPair: 'terra1d7028vhd9u26fqyreee38cj39fwqvcyjps8sjk' as HumanAddr,
      },
      cw20: {
        NEB: 'terra1mpq5zkkm39nmjrjg9raknpfrfmcfwv0nh0whvn' as CW20Addr,
        aUST: 'terra1hzh9vpxhsk8253se0vv5jj6etdvxu3nv8z07zu' as CW20Addr,
      },
      anchor: {
        proxy: 'terra1hhgrnyq3gl78aqwn6hw2p0dena0lrkuq9ndfuu' as HumanAddr,
        market: 'terra1sepfj7s0aeg5967uxnfk4thzlerrsktkpelm5s' as HumanAddr,
      },
    };
  }
}

export function NEBULA_CONSTANTS(network: NetworkInfo): NebulaContants {
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
          txFeeBase: 10_000_000 as Gas,
          txFeePerInventory: 800_000 as Gas,
          txFeePerAsset: 400_000 as Gas,
          gasWantedBase: 10_000_000 as Gas,
          gasWantedPerInventory: 600_000 as Gas,
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
