import { min } from '@libs/big-math';
import { Rate, u, UST } from '@libs/types';
import big, { Big, BigSource } from 'big.js';

export function computeMaxUstBalanceForUstTransfer(
  ustBalance: u<UST<BigSource>>,
  taxRate: Rate,
  maxTaxUUSD: u<UST>,
  fixedGas: u<UST<BigSource>>,
) {
  if (big(ustBalance).lte(0)) {
    return big('0') as u<UST<Big>>;
  }

  const withoutFixedGas = big(ustBalance).minus(fixedGas);

  const txFee = withoutFixedGas.mul(taxRate);

  const result = withoutFixedGas.minus(min(txFee, maxTaxUUSD));

  return result.minus(fixedGas).lte(0)
    ? (big(0) as u<UST<Big>>)
    : (result.minus(fixedGas) as u<UST<Big>>);
}
