import { TERRA_QUERY_KEY } from '@terra-money/webapp-provider';

export enum NEBULA_TX_KEYS {
  FOO = 'NEBULA_TX_FOO',
}

export enum NEBULA_QUERY_KEYS {
  BAR = 'NEBULA_QUERY_BAR',
}

export const NEBULA_TX_REFETCH_MAP = {
  [NEBULA_TX_KEYS.FOO]: [
    TERRA_QUERY_KEY.TOKEN_BALANCES,
    TERRA_QUERY_KEY.TAX,
    NEBULA_QUERY_KEYS.BAR,
  ],
};
