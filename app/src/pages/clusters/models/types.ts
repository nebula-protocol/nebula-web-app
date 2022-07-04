import {
  terraswap,
  UST,
  Token,
  cw20,
  HumanAddr,
  Rate,
  CT,
  u,
} from '@nebula-js/types';
import { ClusterTokenPrices } from '@nebula-js/app-fns';
import { Big } from 'big.js';

export interface AssetView {
  asset: terraswap.Asset<Token>;
  oraclePrice: UST<Big>;
  token: cw20.TokenInfoResponse<Token>;
  amount: u<Token<string>>;
  marketcap: u<UST>;
  targetRatio: number;
  portfolioRatio: number;
  color: string;
  diff: number;
  diffColor: string;
  targetAmount: u<Token<Big>>;
}

export interface ClusterView {
  addr: HumanAddr;
  tokenInfo: cw20.TokenInfoResponse<Token>;
  name: string;
  nameLowerCase: string;
  description: string;
  prices: ClusterTokenPrices;
  hr24: Rate<Big>;
  hr24diff: Rate<Big>;
  provided: u<UST<Big>>;
  marketCap: u<UST<Big>>;
  volume: u<UST<Big>>;
  assets: AssetView[];
  liquidity: u<UST<Big>>;
  totalSupply: u<CT>;
  isActive: boolean;
}
