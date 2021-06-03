import { NetworkInfo } from '@terra-money/wallet-provider';
import { CW20Contract } from '@terra-money/webapp-provider';

// TODO please fill the contract addresses on this
export const ADDRESSES = {
  mainnet: {
    cw20: {
      aUST: 'terra1hzh9vpxhsk8253se0vv5jj6etdvxu3nv8z07zu',
      bLuna: 'terra1kc87mu460fwkqte29rquh4hc20m54fxwtsx7gp',
      ANC: 'terra14z56l0fp2lsf86zy3hty2z47ezkhnthtr9yq76',
    },
  },
  testnet: {
    cw20: {
      aUST: 'terra1ajt556dpzvjwl0kl5tzku3fc3p3knkg9mkv8jl',
      bLuna: 'terra1u0t35drzyy0mujj8rkdyzhe264uls4ug3wdp3x',
      ANC: 'terra1747mad58h0w4y589y3sk84r5efqdev9q4r02pc',
    },
  },
} as const;

export const CW20_TOKEN_CONTRACTS: Record<
  string,
  Record<string, CW20Contract>
> = {
  mainnet: {
    uaUST: {
      contractAddress: ADDRESSES.mainnet.cw20.aUST,
    },
    ubLuna: {
      contractAddress: ADDRESSES.mainnet.cw20.bLuna,
    },
    uANC: {
      contractAddress: ADDRESSES.mainnet.cw20.ANC,
    },
  },
  testnet: {
    uaUST: {
      contractAddress: ADDRESSES.testnet.cw20.aUST,
    },
    ubLuna: {
      contractAddress: ADDRESSES.testnet.cw20.bLuna,
    },
    uANC: {
      contractAddress: ADDRESSES.testnet.cw20.ANC,
    },
  },
};

export const MAX_CAP_TOKEN_DENOMS: Record<string, string> = {
  maxTaxUUSD: 'uusd',
};

export const DEFAULT_NETWORK: NetworkInfo = {
  name: 'mainnet',
  chainID: 'columbus-4',
  lcd: 'https://lcd.terra.dev',
};

export const WALLETCONNECT_CHANNEL_IDS: Record<number, NetworkInfo> = {
  0: {
    name: 'testnet',
    chainID: 'tequila-0004',
    lcd: 'https://tequila-lcd.terra.dev',
  },
  1: {
    name: 'mainnet',
    chainID: 'columbus-4',
    lcd: 'https://lcd.terra.dev',
  },
};

export const ON_PRODUCTION =
  global.location.host === 'app.anchorprotocol.com' ||
  global.location.host === 'app.anchor.money' ||
  global.location.host === 'app.anchor.market' ||
  global.location.host === 'anchorprotocol.com' ||
  global.location.host === 'anchor.money' ||
  global.location.host === 'anchor.market';

// TODO: change this google analytics tracking id - currently this id is anchor's
export const GA_TRACKING_ID = 'G-H42LRVHR5Y';
