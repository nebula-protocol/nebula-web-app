import { GasPrice } from '@libs/app-fns';
import { Gas, u, UST } from '@libs/types';
import big from 'big.js';

export function computeBulkSwapTxFee(
  gasPrice: GasPrice,
  swapGasWantedPerAsset: number,
  assetCount: number,
): u<UST> {
  return big(computeBulkSwapGasWanted(swapGasWantedPerAsset, assetCount))
    .mul(gasPrice.uusd)
    .toFixed() as u<UST>;
}

export function computeBulkSwapGasWanted(
  swapGasWantedPerAsset: number,
  assetCount: number,
): Gas {
  return big(swapGasWantedPerAsset).mul(assetCount).toNumber() as Gas;
}
