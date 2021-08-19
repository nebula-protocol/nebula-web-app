import { Rate, u, Luna, NEB, UST } from '@nebula-js/types';

// gas_price = uusd of https://[tequila-]fcd.terra.dev/v1/txs/gas_prices
// assetLength = length of cluster_info.target
// (base * gas_price) + (assetLength * (perAsset * gas_price))
export interface ClusterFee {
  base: number;
  perAsset: number;
}

export interface NebulaContants {
  gasFee: u<UST<number>>;
  fixedGas: u<UST<number>>;
  blocksPerYear: number;
  gasAdjustment: Rate<number>;
  gasPriceEndpoint: string;
  clusterFee: ClusterFee;
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
