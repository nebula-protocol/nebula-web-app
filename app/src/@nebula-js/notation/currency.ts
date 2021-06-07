import {
  CT,
  CW20Token,
  Luna,
  NativeToken,
  NEB,
  Token,
  uCT,
  uCW20Token,
  uLuna,
  uNativeToken,
  uNEB,
  UST,
  uToken,
  uUST,
} from '@nebula-js/types';
import big, { Big, BigSource } from 'big.js';

// ---------------------------------------------
// micro
// ---------------------------------------------
export const MICRO = 1000000;

export function microfy<
  C extends  // native tokens
    | UST<BigSource>
    | Luna<BigSource>
    // cw20 tokens
    | CT<BigSource>
    | NEB<BigSource>
    // union tokens
    | NativeToken<BigSource>
    | CW20Token<BigSource>
    | Token<BigSource>
>(
  amount: C,
): C extends UST
  ? uUST<Big>
  : C extends Luna
  ? uLuna<Big>
  : C extends CT
  ? uCT<Big>
  : C extends NEB
  ? uNEB<Big>
  : C extends NativeToken
  ? uNativeToken<Big>
  : C extends CW20Token
  ? uCW20Token<Big>
  : C extends Token
  ? uToken<Big>
  : never {
  return big(amount).mul(MICRO) as any;
}

export function demicrofy<
  C extends  // native tokens
    | uUST<BigSource>
    | uLuna<BigSource>
    // cw20 tokens
    | uCT<BigSource>
    | uNEB<BigSource>
    // union tokens
    | uNativeToken<BigSource>
    | uCW20Token<BigSource>
    | uToken<BigSource>
>(
  amount: C,
): C extends uUST
  ? UST<Big>
  : C extends uLuna
  ? Luna<Big>
  : C extends uCT
  ? CT<Big>
  : C extends uNEB
  ? NEB<Big>
  : C extends uNativeToken
  ? NativeToken<Big>
  : C extends uCW20Token
  ? CW20Token<Big>
  : C extends uToken
  ? Token<Big>
  : never {
  return big(amount).div(MICRO) as any;
}
