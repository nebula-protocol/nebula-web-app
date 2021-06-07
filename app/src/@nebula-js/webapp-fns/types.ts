import { Rate, uLuna, uNEB, uUST } from '@nebula-js/types';

export interface NebulaContants {
  gasFee: uUST<number>;
  fixedGas: uUST<number>;
  blocksPerYear: number;
  gasAdjustment: Rate<number>;
}

/**
 * You can cast the token values as nominal types
 *
 * @example
 * ```
 * // const { tokenBalances: { uUST } } = useBank() // Record<string, string>
 * const { tokenBalances: { uUST } } = useBank<NebulaTokens>() // { uUST: uUST }
 * ```
 */
export interface NebulaTokenBalances {
  // native tokens
  uUST: uUST;
  uLuna: uLuna;
  // cw20 tokens
  uNEB: uNEB;
}

/**
 * You can cast the tax values as nominal types
 *
 * @example
 * ```
 * // const { tax: { taxRate, maxTaxUUSD } } = useBank() // { taxRate: string, maxTaxUUSD: string }
 * const { tax: { taxRate, maxTaxUUSD } } = useBank<any, NebulaTax>() // { taxRate: Rate, maxTaxUUSD: uUST }
 * ```
 */
export interface NebulaTax {
  taxRate: Rate;
  maxTaxUUSD: uUST;
}
