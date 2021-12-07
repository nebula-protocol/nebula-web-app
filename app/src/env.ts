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
      airdrop: 'terra179dgjvznfk5x2fsqa3un492l5zu9p9utdncrn7' as HumanAddr,
      collector: 'terra1qvdf64vhtpjfznysr8uqm28exrekaju7j3mpcw' as HumanAddr,
      community: 'terra108u9rg6nhltna8ce3teve8lsnahehljr2273m2' as HumanAddr,
      clusterFactory:
        'terra1q2ft2we9p5p5d624hsamx9k3qc2qkzw4wyg4c6' as HumanAddr,
      gov: 'terra1qugtk3h7tr8s0ltnpheh7gaf43hv9ax7mlg6jc' as HumanAddr,
      incentives: 'terra14j87dwkfmjs48hd3skuxnw2fm0z9x90kruspsn' as HumanAddr,
      incentivesCustody:
        'terra16stw0qmz8mj5uzg672x2t8lfdjqgva7xv3fs5q' as HumanAddr,
      staking: 'terra1n9vdcgkd3dnqdq50kncd7e3vqj3uthg434knrd' as HumanAddr,
      terraswap: {
        factory: 'terra18qpjm4zkvqnpjpw0zn0tdr8gdzvt8au35v45xf' as HumanAddr,
        nebUstPair: 'terra17ld5j4588k8w9hhtrllyj0537eqndkhr679m72' as HumanAddr,
      },
      cw20: {
        NEB: 'terra1nknarneeatpm7amzw4rhxhcaqyt3ecx6y7k5yq' as CW20Addr,
      },
    };
  }

  throw new Error(`currently only support "bombay-12"`);
}

export function NEBULA_CONSTANTS(network: NetworkInfo): NebulaContants {
  if (network.chainID.startsWith('bombay')) {
    return {
      gasWanted: 2_000_000 as Gas,
      fixedGas: 2_000_000 as Gas,
      blocksPerYear: 4_656_810,
      gasAdjustment: 1.6 as Rate<number>,
      nebula: {
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
    NEBULA_QUERY_KEYS.GOV_STAKER,
  ],
  [NEBULA_TX_KEYS.GOV_UNSTAKE]: [
    TERRA_QUERY_KEY.TOKEN_BALANCES,
    TERRA_QUERY_KEY.CW20_BALANCE,
    TERRA_QUERY_KEY.TERRA_BALANCES,
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
};
