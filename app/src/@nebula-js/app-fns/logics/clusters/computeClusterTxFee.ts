import { Gas, u, UST } from '@libs/types';
import { GasPrice } from '@libs/app-fns';
import { ClusterFeeMultipliers } from '@nebula-js/app-fns';
import big from 'big.js';

export function computeClusterTxFee(
  gasPrice: GasPrice,
  multiplier: ClusterFeeMultipliers,
  inventory: number,
  assetCount: number,
): u<UST> {
  return big(multiplier.txFeeBase)
    .plus(big(inventory).mul(multiplier.txFeePerInventory))
    .plus(big(assetCount).mul(multiplier.txFeePerAsset))
    .mul(gasPrice.uusd)
    .toFixed() as u<UST>;
}

export function computeClusterGasWanted(
  multiplier: ClusterFeeMultipliers,
  inventory: number,
  assetCount: number,
): Gas {
  console.log(
    'computeClusterTxFee.ts..computeClusterGasWanted()',
    multiplier,
    inventory,
    assetCount,
  );
  return big(multiplier.gasWantedBase)
    .plus(big(inventory).mul(multiplier.gasWantedPerInventory))
    .plus(big(assetCount).mul(multiplier.gasWantedPerAsset))
    .toNumber() as Gas;
}
