import type { u, Luna } from '@nebula-js/types';
import big, { BigSource } from 'big.js';

export function validateTxFee(
  lunaBalance: u<Luna<BigSource>> | undefined,
  txFee: u<Luna<BigSource>>,
): string | undefined {
  if (big(lunaBalance ?? 0).lt(txFee)) {
    return 'Not enough transaction fees';
  }
  return undefined;
}
