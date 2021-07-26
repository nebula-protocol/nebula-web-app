import { NominalType } from './common';

export type u<T = string> = T & { __micro: T };

// Native currencies
export type UST<T = string> = T & NominalType<'ust'>;
export type Luna<T = string> = T & NominalType<'luna'>;

// CW20 currencies
export type CT<T = string> = T & NominalType<'ct'>;
export type NEB<T = string> = T & NominalType<'neb'>;

// LP currencies
export type LP<T = string> = T & NominalType<'lp'>;

// Union currencies
export type NativeToken<T = string> = T & NominalType<'ust' | 'luna'>;
export type CW20Token<T = string> = T & NominalType<'ct' | 'neb'>;

export type Token<T = string> = T &
  NominalType<'ust' | 'luna' | 'ct' | 'neb' | 'lp'>;
