import { NominalType } from '../common';

export type HumanAddr = string & NominalType<'HumanAddr'>;
export type CanonicalAddr = string & NominalType<'CanonicalAddr'>;
export type CW20Addr = string & NominalType<'CW20Addr'>;

export type StableDenom = string & NominalType<'StableDenom'>;
export type bAssetDenom = string & NominalType<'bAssetDenom'>;
export type AssetDenom = string & NominalType<'AssetDenom'>;
export type Denom = StableDenom | bAssetDenom | AssetDenom;

export type Base64EncodedJson = string & NominalType<'Base64EncodedJson'>;

export type WASMContractResult = {
  Result: string;
};

export namespace rs {
  export type u8 = number;
  export type u32 = number;
  export type u64 = number;
  // TODO is this number or string?
  export type Uint128 = number;
  // TODO is this number or string?
  export type Decimal = number;
}

export enum OrderBy {
  Asc = 'Asc',
  Desc = 'Desc',
}

export interface ContractAddress {
  airdrop: HumanAddr;
  cluster: HumanAddr;
  clusterFactory: HumanAddr;
  collector: HumanAddr;
  community: HumanAddr;
  gov: HumanAddr;
  incentives: HumanAddr;
  incentivesCustody: HumanAddr;
  penalty: HumanAddr;
  staking: HumanAddr;

  terraswap: {
    nebUstPair: HumanAddr;
  };

  cw20: {
    NEB: CW20Addr;
  };
}
