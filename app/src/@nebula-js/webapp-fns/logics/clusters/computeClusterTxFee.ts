import { u, UST } from '@libs/types';
import { GasPrice } from '@libs/webapp-fns';
import { ClusterFeeInput } from '@nebula-js/webapp-fns';
import big, { Big } from 'big.js';

export function computeClusterTxFee(
  gasPrice: GasPrice,
  clusterFee: ClusterFeeInput,
  assetLength: number,
): u<UST<Big>> {
  return big(big(clusterFee.base).mul(gasPrice.uusd)).plus(
    big(assetLength).mul(big(clusterFee.perAsset).mul(gasPrice.uusd)),
  ) as u<UST<Big>>;
}
