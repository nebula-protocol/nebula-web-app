import { u } from '@nebula-js/types';
import big, { BigSource } from 'big.js';

// ---------------------------------------------
// micro
// ---------------------------------------------
export const MICRO = 1000000;

export function microfy<T extends BigSource>(amount: T): u<T> {
  return big(amount).mul(MICRO) as any;
}

export function demicrofy<T extends BigSource>(amount: u<T>): T {
  return big(amount).div(MICRO) as any;
}
