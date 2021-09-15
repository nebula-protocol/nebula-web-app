import { Gas, Luna, NEB, Rate, u, UST } from '@nebula-js/types';

// gas_price = uusd of https://[tequila-]fcd.terra.dev/v1/txs/gas_prices
// txFee = (txFeeBase + (inventory * txFeePerInventory) + (asset count * txFeePerAsset)) * gas_price
// gasWanted = gasWantedBase + (inventory * gasWantedPerInventory) + (asset count * gasWantedPerAsset)
export interface ClusterFeeMultipliers {
  txFeeBase: Gas;
  txFeePerInventory: Gas;
  txFeePerAsset: Gas;
  gasWantedBase: Gas;
  gasWantedPerInventory: Gas;
  gasWantedPerAsset: Gas;
}

export interface ClusterFeeInput {
  default: ClusterFeeMultipliers;
  arbMint: ClusterFeeMultipliers;
  //base: Gas;
  //perAsset: Gas;
  //gasLimitPerAsset: Gas;
}

export interface NebulaContantsInput {
  gasWanted: Gas;
  fixedGas: Gas;
  //fixedGas: u<UST<number>>;
  blocksPerYear: number;
  gasAdjustment: Rate<number>;
  //gasPriceEndpoint: string;
  clusterFee: ClusterFeeInput;
}

export interface NebulaContants extends NebulaContantsInput {
  fixedFee: u<UST<number>>;
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
