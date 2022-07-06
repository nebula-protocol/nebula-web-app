import { min } from '@libs/big-math';
import { Rate, u, Luna } from '@libs/types';
import big, { Big, BigSource } from 'big.js';

export function computeMaxLunaBalanceForTransfer(
  lunaBalance: u<Luna<BigSource>>,
  taxRate: Rate,
  maxTaxUUSD: u<Luna>,
  fixedFee: u<Luna<BigSource>>,
) {
  if (big(lunaBalance).lte(0)) {
    return big('0') as u<Luna<Big>>;
  }

  const withoutFixedGas = big(lunaBalance).minus(fixedFee);

  const txFee = withoutFixedGas.mul(taxRate);

  const result = withoutFixedGas.minus(min(txFee, maxTaxUUSD));

  return result.minus(fixedFee).lte(0)
    ? (big(0) as u<Luna<Big>>)
    : (result.minus(fixedFee) as u<Luna<Big>>);
}
