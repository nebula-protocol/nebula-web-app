import { Gas, HumanAddr, Rate } from '@libs/types';

/**
 * You can cast the tax values as nominal types
 *
 * @example
 * ```
 * // const { tax: { taxRate, maxTaxUUSD } } = useBank() // { taxRate: string, maxTaxUUSD: string }
 * const { tax: { taxRate, maxTaxUUSD } } = useBank<any, NebulaTax>() // { taxRate: Rate, maxTaxUUSD: uUST }
 * ```
 */
//export interface Tax {
//  taxRate: Rate;
//  maxTaxUUSD: u<UST>;
//}

export interface AppContractAddress {
  terraswap: {
    factory: HumanAddr;
  };
}

export interface AppConstants {
  gasWanted: Gas;
  fixedGas: Gas;
  blocksPerYear: number;
  gasAdjustment: Rate<number>;
}
