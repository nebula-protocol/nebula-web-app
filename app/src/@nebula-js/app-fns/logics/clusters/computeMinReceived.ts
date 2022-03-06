import { Token, Rate, u } from '@nebula-js/types';
import big from 'big.js';

export function computeMinReceivedAmount<toToken extends u<Token>>(
  toAmount: toToken,
  maxSpread: Rate,
): toToken {
  const rate = big(1).minus(maxSpread).toFixed();

  return big(toAmount).mul(rate).toFixed(0) as toToken;
}
