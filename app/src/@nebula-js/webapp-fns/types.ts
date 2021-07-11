import { Rate, u, Luna, NEB, UST } from '@nebula-js/types';

export interface NebulaContants {
  gasFee: u<UST<number>>;
  fixedGas: u<UST<number>>;
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
  uUST: u<UST>;
  uLuna: u<Luna>;
  // cw20 tokens
  uNEB: u<NEB>;
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
  maxTaxUUSD: u<UST>;
}
