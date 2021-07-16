import { u, UST } from '@nebula-js/types';
import { NebulaTax } from '../types';
import { max, min } from '@terra-dev/big-math';
import big, { Big, BigSource } from 'big.js';

export function computeMaxUstBalanceForUstTransfer(
  ustBalance: u<UST<BigSource>>,
  tax: NebulaTax,
  fixedGas: u<UST<BigSource>>,
) {
  const txFee = min(
    max(
      big(big(ustBalance).minus(fixedGas)).div(
        big(big(1).plus(tax.taxRate)).mul(tax.taxRate),
      ),
      0,
    ),
    tax.maxTaxUUSD,
  );

  return max(big(ustBalance).minus(txFee).minus(big(fixedGas).mul(2)), 0) as u<
    UST<Big>
  >;
}
