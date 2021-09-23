import { TERRA_QUERY_KEY, TERRA_TX_KEYS } from '@libs/app-provider';
import { CW20Addr, Gas, HumanAddr, Rate } from '@libs/types';
import { NebulaContants, NebulaContractAddress } from '@nebula-js/app-fns';
import { NEBULA_QUERY_KEYS, NEBULA_TX_KEYS } from '@nebula-js/app-provider';
import { NetworkInfo } from '@terra-dev/wallet-types';

export function nebulaDefaultWasmClient(network: NetworkInfo): 'lcd' | 'hive' {
  if (network.chainID === 'tequila-0004') {
    return Math.random() > 0.5 ? 'lcd' : 'hive';
  }

  throw new Error(`currently only support "tequila-0004"`);
}

export function nebulaContractAddress(
  network: NetworkInfo,
): NebulaContractAddress {
  if (network.chainID === 'tequila-0004') {
    return {
      airdrop: 'terra1z4zrm0fpuh6dq3fea3xhgf93lr30z98pzksftt' as HumanAddr,
      collector: 'terra14xwh27azy0dkp3yceh4chcaeay5ax260puxfl7' as HumanAddr,
      community: 'terra1fxnzfjgfvr8g6v0nxnwfjmt5vcmt64k5l5cn9y' as HumanAddr,
      clusterFactory:
        'terra1zdga7ntu73qzevtk44amefqze05k5gkwu82k05' as HumanAddr,
      gov: 'terra17ry0egj85545rd3lllda4g48z7qrgkt4nu3ym2' as HumanAddr,
      incentives: 'terra180sav47jd7npzc9pepqzmed2m6g3g50v44ndd5' as HumanAddr,
      incentivesCustody:
        'terra16ju95fyez67xxqqlelf3wjz74kankq30z780tx' as HumanAddr,
      staking: 'terra1gt2h9zu6c753h5ufv9a0n8hwlnpwfr2a4wyrc3' as HumanAddr,
      terraswap: {
        factory: 'terra18qpjm4zkvqnpjpw0zn0tdr8gdzvt8au35v45xf' as HumanAddr,
        nebUstPair: 'terra1wlzgd4qa3w7ua9nhw454u7gfaxjkmlkuf3fk7f' as HumanAddr,
      },
      cw20: {
        NEB: 'terra1c56uwrm8pukfh3q8ul460er7t32mth47gy8kmx' as CW20Addr,
      },
    };
  }

  throw new Error(`currently only support "tequila-0004"`);
}

export function nebulaConstants(network: NetworkInfo): NebulaContants {
  if (network.chainID === 'tequila-0004') {
    return {
      gasWanted: 1_000_000 as Gas,
      fixedGas: 1_671_053 as Gas,
      blocksPerYear: 4_656_810,
      gasAdjustment: 1.6 as Rate<number>,
      clusterFee: {
        default: {
          txFeeBase: 2_000_000 as Gas,
          txFeePerInventory: 600_000 as Gas,
          txFeePerAsset: 400_000 as Gas,
          gasWantedBase: 1_000_000 as Gas,
          gasWantedPerInventory: 400_000 as Gas,
          gasWantedPerAsset: 280_000 as Gas,
        },
        arbMint: {
          txFeeBase: 2_000_000 as Gas,
          txFeePerInventory: 800_000 as Gas,
          txFeePerAsset: 400_000 as Gas,
          gasWantedBase: 1_000_000 as Gas,
          gasWantedPerInventory: 600_000 as Gas,
          gasWantedPerAsset: 280_000 as Gas,
        },
      },
    };
  }

  throw new Error(`currently only support "tequila-0004"`);
}

//export const CW20_TOKEN_CONTRACTS: Record<
//  string,
//  Record<string, CW20Contract>
//> = {
//  //mainnet: {
//  //  uNEB: {
//  //    contractAddress: ADDRESSES.mainnet.cw20.aUST,
//  //  },
//  //},
//  testnet: {
//    uNEB: {
//      contractAddress: DEFAULT_NEBULA_CONTRACT_ADDRESS['testnet'].cw20.NEB,
//    },
//  },
//};
//
//export const MAX_CAP_TOKEN_DENOMS: Record<string, string> = {
//  maxTaxUUSD: 'uusd',
//};

export const TESTNET = {
  name: 'testnet',
  chainID: 'tequila-0004',
  lcd: 'https://tequila-lcd.terra.dev',
};

export const MAINNET = {
  name: 'mainnet',
  chainID: 'columbus-4',
  lcd: 'https://lcd.terra.dev',
};

export const DEFAULT_NETWORK: NetworkInfo = TESTNET;

export const WALLETCONNECT_CHANNEL_IDS: Record<number, NetworkInfo> = {
  0: TESTNET,
  1: MAINNET,
};

export const ON_PRODUCTION = global.location.host === 'app.nebulaprotocol.com';

// TODO: set ga tracking id
export const GA_TRACKING_ID = (() => {
  try {
    return import.meta.env.GA_TRACKING_ID;
  } catch {
    return undefined;
  }
})();

export const NEBULA_TX_REFETCH_MAP = {
  [TERRA_TX_KEYS.CW20_BUY]: [
    TERRA_QUERY_KEY.TOKEN_BALANCES,
    TERRA_QUERY_KEY.CW20_BALANCE,
    TERRA_QUERY_KEY.TERRA_BALANCES,
  ],
  [TERRA_TX_KEYS.CW20_SELL]: [
    TERRA_QUERY_KEY.TOKEN_BALANCES,
    TERRA_QUERY_KEY.CW20_BALANCE,
    TERRA_QUERY_KEY.TERRA_BALANCES,
  ],
  [TERRA_TX_KEYS.SEND]: [
    TERRA_QUERY_KEY.TOKEN_BALANCES,
    TERRA_QUERY_KEY.CW20_BALANCE,
    TERRA_QUERY_KEY.TERRA_BALANCES,
  ],
  [NEBULA_TX_KEYS.CLUSTER_MINT]: [
    TERRA_QUERY_KEY.TOKEN_BALANCES,
    TERRA_QUERY_KEY.CW20_BALANCE,
    TERRA_QUERY_KEY.TERRA_BALANCES,
  ],
  [NEBULA_TX_KEYS.CLUSTER_ARB_MINT]: [
    TERRA_QUERY_KEY.TOKEN_BALANCES,
    TERRA_QUERY_KEY.CW20_BALANCE,
    TERRA_QUERY_KEY.TERRA_BALANCES,
  ],
  [NEBULA_TX_KEYS.CLUSTER_REDEEM]: [
    TERRA_QUERY_KEY.TOKEN_BALANCES,
    TERRA_QUERY_KEY.CW20_BALANCE,
    TERRA_QUERY_KEY.TERRA_BALANCES,
  ],
  [NEBULA_TX_KEYS.CLUSTER_ARB_REDEEM]: [
    TERRA_QUERY_KEY.TOKEN_BALANCES,
    TERRA_QUERY_KEY.CW20_BALANCE,
    TERRA_QUERY_KEY.TERRA_BALANCES,
  ],
  [NEBULA_TX_KEYS.STAKING_STAKE]: [
    TERRA_QUERY_KEY.TOKEN_BALANCES,
    TERRA_QUERY_KEY.CW20_BALANCE,
    TERRA_QUERY_KEY.TERRA_BALANCES,
    NEBULA_QUERY_KEYS.STAKING_REWARD_INFO,
  ],
  [NEBULA_TX_KEYS.STAKING_UNSTAKE]: [
    TERRA_QUERY_KEY.TOKEN_BALANCES,
    TERRA_QUERY_KEY.CW20_BALANCE,
    TERRA_QUERY_KEY.TERRA_BALANCES,
    NEBULA_QUERY_KEYS.STAKING_REWARD_INFO,
  ],
  [NEBULA_TX_KEYS.GOV_STAKE]: [
    TERRA_QUERY_KEY.TOKEN_BALANCES,
    TERRA_QUERY_KEY.CW20_BALANCE,
    TERRA_QUERY_KEY.TERRA_BALANCES,
    TERRA_QUERY_KEY.CW20_TOKEN_INFO,
    NEBULA_QUERY_KEYS.GOV_STATE,
  ],
  [NEBULA_TX_KEYS.GOV_UNSTAKE]: [
    TERRA_QUERY_KEY.TOKEN_BALANCES,
    TERRA_QUERY_KEY.CW20_BALANCE,
    TERRA_QUERY_KEY.TERRA_BALANCES,
    TERRA_QUERY_KEY.CW20_TOKEN_INFO,
    NEBULA_QUERY_KEYS.GOV_STATE,
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
};
