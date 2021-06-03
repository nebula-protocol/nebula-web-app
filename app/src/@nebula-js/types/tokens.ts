import { NominalType } from './common';

// Native currencies
export type uUST<T = string> = T & NominalType<'uust'>;
export type UST<T = string> = T & NominalType<'ust'>;

export type uLuna<T = string> = T & NominalType<'uluna'>;
export type Luna<T = string> = T & NominalType<'luna'>;

// CW20 currencies
export type uCT<T = string> = T & NominalType<'uct'>;
export type CT<T = string> = T & NominalType<'ct'>;

export type uNEB<T = string> = T & NominalType<'uneb'>;
export type NEB<T = string> = T & NominalType<'neb'>;

// Union currencies
export type uNativeToken<T = string> = T & NominalType<'uust' | 'uluna'>;

export type NativeToken<T = string> = T & NominalType<'ust' | 'luna'>;

export type uCW20Token<T = string> = T & NominalType<'uct' | 'uneb'>;

export type CW20Token<T = string> = T & NominalType<'ct' | 'neb'>;

//export type uLPToken<T = string> = T &
//  NominalType<'uanc_ust_lp' | 'ubluna_luna_lp'>;
//
//export type LPToken<T = string> = T &
//  NominalType<'anc_ust_lp' | 'bluna_luna_lp'>;

export type uToken<T = string> = T &
  NominalType<'uust' | 'uluna' | 'uct' | 'uneb'>;

export type Token<T = string> = T & NominalType<'ust' | 'luna' | 'ct' | 'neb'>;
