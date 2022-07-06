import big, { Big, BigSource } from 'big.js';
import { u, Luna } from '@nebula-js/types';

export function computeMaxLunaBalanceForSwap(
  lunaBalance: u<Luna<BigSource>>,
  swapFee: u<Luna<BigSource>>,
  mintClusterFee: u<Luna<BigSource>>,
): u<Luna<Big>> {
  if (big(lunaBalance).lte(0)) {
    return big('0') as u<Luna<Big>>;
  }

  const maxBalance = big(lunaBalance).minus(swapFee).minus(mintClusterFee) as u<
    Luna<Big>
  >;

  return maxBalance.lt(0) ? (big(0) as u<Luna<Big>>) : maxBalance;
}
