import { GasPrice } from '@libs/app-fns';
import { Gas, u, Luna } from '@libs/types';
import big from 'big.js';
import { ClusterFeeMultipliers } from '../../types';

export function computeClusterTxFee(
  gasPrice: GasPrice,
  multiplier: ClusterFeeMultipliers,
  inventory: number,
  assetCount: number,
): u<Luna> {
  return big(multiplier.txFeeBase)
    .plus(big(inventory).mul(multiplier.txFeePerInventory))
    .plus(big(assetCount).mul(multiplier.txFeePerAsset))
    .mul(gasPrice.uluna)
    .toFixed() as u<Luna>;
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
