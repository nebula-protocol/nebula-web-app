import { CW20Contract } from '@libs/app-fns';
import { DEFAULT_NEBULA_CONTRACT_ADDRESS } from '@nebula-js/webapp-fns';
import { NetworkInfo } from '@terra-money/wallet-provider';

export const CW20_TOKEN_CONTRACTS: Record<
  string,
  Record<string, CW20Contract>
> = {
  //mainnet: {
  //  uNEB: {
  //    contractAddress: ADDRESSES.mainnet.cw20.aUST,
  //  },
  //},
  testnet: {
    uNEB: {
      contractAddress: DEFAULT_NEBULA_CONTRACT_ADDRESS['testnet'].cw20.NEB,
    },
  },
};

export const MAX_CAP_TOKEN_DENOMS: Record<string, string> = {
  maxTaxUUSD: 'uusd',
};

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

export const ON_PRODUCTION =
  global.location.host === 'app.anchorprotocol.com' ||
  global.location.host === 'app.anchor.money' ||
  global.location.host === 'app.anchor.market' ||
  global.location.host === 'anchorprotocol.com' ||
  global.location.host === 'anchor.money' ||
  global.location.host === 'anchor.market';

// TODO: set ga tracking id
export const GA_TRACKING_ID = process.env.GA_TRACKING_ID;
