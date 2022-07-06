import { CT, Luna, u, terraswap } from '@nebula-js/types';
import big, { Big } from 'big.js';

export function computeLiquidity(
  terraswapPool: terraswap.pair.PoolResponse<CT, Luna>,
): u<Luna<Big>> {
  const lunaIndex = terraswapPool.assets.findIndex(
    (asset) =>
      'native_token' in asset.info && asset.info.native_token.denom === 'uluna',
  )!;

  return big(terraswapPool.assets[lunaIndex].amount).mul(2) as u<Luna<Big>>;
}
