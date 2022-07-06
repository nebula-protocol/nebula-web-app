import { GasPrice } from '@libs/app-fns';
import { Gas, u, Luna } from '@libs/types';
import big from 'big.js';

export function computeBulkSwapTxFee(
  gasPrice: GasPrice,
  swapGasWantedPerAsset: number,
  assetCount: number,
): u<Luna> {
  return big(computeBulkSwapGasWanted(swapGasWantedPerAsset, assetCount))
    .mul(gasPrice.uluna)
    .toFixed() as u<Luna>;
}

export function computeBulkSwapGasWanted(
  swapGasWantedPerAsset: number,
  assetCount: number,
): Gas {
  return big(swapGasWantedPerAsset).mul(assetCount).toNumber() as Gas;
}
