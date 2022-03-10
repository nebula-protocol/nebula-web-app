import { CT, UST, u, terraswap } from '@nebula-js/types';
import big, { Big } from 'big.js';

export function computeLiquidity(
  terraswapPool: terraswap.pair.PoolResponse<CT, UST>,
): u<UST<Big>> {
  const ustIndex = terraswapPool.assets.findIndex(
    (asset) =>
      'native_token' in asset.info && asset.info.native_token.denom === 'uusd',
  )!;

  return big(terraswapPool.assets[ustIndex].amount).mul(2) as u<UST<Big>>;
}
