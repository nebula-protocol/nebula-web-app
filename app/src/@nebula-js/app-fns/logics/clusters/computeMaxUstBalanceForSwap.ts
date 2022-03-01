import big, { Big, BigSource } from 'big.js';
import { u, UST } from '@nebula-js/types';

export function computeMaxUstBalanceForSwap(
  ustBalance: u<UST<BigSource>>,
  swapFee: u<UST<BigSource>>,
  mintClusterFee: u<UST<BigSource>>,
): u<UST<Big>> {
  if (big(ustBalance).lte(0)) {
    return big('0') as u<UST<Big>>;
  }

  const maxBalance = big(ustBalance).minus(swapFee).minus(mintClusterFee) as u<
    UST<Big>
  >;

  return maxBalance.lt(0) ? (big(0) as u<UST<Big>>) : maxBalance;
}
