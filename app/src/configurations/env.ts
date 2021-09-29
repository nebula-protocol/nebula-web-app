import { TERRA_QUERY_KEY, TERRA_TX_KEYS } from '@libs/app-provider';
import { CW20Addr, Gas, HumanAddr, Rate } from '@libs/types';
import {
  NEBULA_QUERY_KEYS,
  NEBULA_TX_KEYS,
  NebulaContants,
  NebulaContractAddress,
} from '@nebula-js/app-provider';
import { NetworkInfo } from '@terra-dev/wallet-types';

export function NEBULA_DEFAULT_WASM_CLIENT(
  network: NetworkInfo,
): 'lcd' | 'hive' {
  return network.chainID.startsWith('tequila') ? 'hive' : 'lcd';
}

export function NEBULA_CONTRACT_ADDRESS(
  network: NetworkInfo,
): NebulaContractAddress {
  if (network.chainID.startsWith('tequila')) {
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
  } else if (network.chainID.startsWith('bombay')) {
    return {
      airdrop: 'terra19dm5qdxvfkxxxw9kee8655gxkv97y5v3t3yn8d' as HumanAddr,
      collector: 'terra1g4cquyyua48ua7apvl6qq4u4ghmj4sce5gv46m' as HumanAddr,
      community: 'terra1nz7mhxttv8tmjh7kq4rttnm6vrcdmcjh8ugz5g' as HumanAddr,
      clusterFactory:
        'terra14dz2cgqtc3ug89vztp5fx8tt99chnts5zusq69' as HumanAddr,
      gov: 'terra1wymnvrerea4ydar55dftjszcfec0hej0a434s3' as HumanAddr,
      incentives: 'terra14hetryc3qn0mw7arq8pmvf842jd8dfr4yydptp' as HumanAddr,
      incentivesCustody:
        'terra1md4gk73gw5rnlra09gjr7w228h5ghgeu8q9hwy' as HumanAddr,
      staking: 'terra1zcvr232eyd4s2a56nkpz4sh0uplpwj7k0grcrl' as HumanAddr,
      terraswap: {
        factory: 'terra18qpjm4zkvqnpjpw0zn0tdr8gdzvt8au35v45xf' as HumanAddr,
        nebUstPair: 'terra1xghjhk4u4x49f5lpsz3sgc3a6ta8wh89gnt30t' as HumanAddr,
      },
      cw20: {
        NEB: 'terra17rfslz2j8zf9nmfvmzlvr68csjy6x78eyzms7x' as CW20Addr,
      },
    };
  }

  throw new Error(`currently only support "tequila-0004" or "bombay-12"`);
}

export function NEBULA_CONSTANTS(network: NetworkInfo): NebulaContants {
  if (
    network.chainID.startsWith('tequila') ||
    network.chainID.startsWith('bombay')
  ) {
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

  throw new Error(`currently only support "tequila-0004" or "bombay-12"`);
}

export const ON_PRODUCTION = global.location.host === 'app.nebulaprotocol.com';

export const WALLETCONNECT_BRIDGE_SERVER = ON_PRODUCTION
  ? 'https://walletconnect.terra.dev/'
  : 'https://tequila-walletconnect.terra.dev/';

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
