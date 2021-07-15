import { CW20Addr } from '@nebula-js/types';

export interface CW20TokenInfo {
  protocol: string;
  symbol: string;
  token: CW20Addr;
  icon: string;
}

export interface CW20Tokens {
  mainnet: Record<CW20Addr, CW20TokenInfo>;
  testnet: Record<CW20Addr, CW20TokenInfo>;
}

export async function terraCW20TokensQuery(): Promise<CW20Tokens> {
  return fetch(`https://assets.terra.money/cw20/tokens.json`).then((res) =>
    res.json(),
  );
}
