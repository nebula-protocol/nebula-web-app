import { u, UST } from '@nebula-js/types';
import { min } from '@terra-dev/big-math';
import big, { Big, BigSource } from 'big.js';
import { NebulaTax } from '../types';

export function computeMaxUstBalanceForUstTransfer(
  ustBalance: u<UST<BigSource>>,
  tax: NebulaTax,
  fixedGas: u<UST<BigSource>>,
) {
  if (big(ustBalance).lte(0)) {
    return big('0') as u<UST<Big>>;
  }

  const withoutFixedGas = big(ustBalance).minus(fixedGas);

  const txFee = withoutFixedGas.mul(tax.taxRate);

  const result = withoutFixedGas.minus(min(txFee, tax.maxTaxUUSD));

  return result.minus(fixedGas).lte(0)
    ? (big(0) as u<UST<Big>>)
    : (result.minus(fixedGas) as u<UST<Big>>);
}
