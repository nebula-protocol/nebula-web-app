import { NominalType } from '@libs/types';

// CW20 currencies
export type CT<T = string> = T & NominalType<'ct'>;
export type NEB<T = string> = T & NominalType<'neb'>;

// Union currencies
export type CW20Token<T = string> = T & NominalType<'ct' | 'neb'>;
