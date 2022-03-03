import { CT, Token, u, Rate, UST } from '@nebula-js/types';
import big, { Big } from 'big.js';
import { divWithDefault } from '@libs/big-math';
import { microfy, demicrofy } from '@libs/formatter';

// TODO: revisit micro or non-micro convention and redundant logical
export function computeMinReceivedToken(
  ustAmount: UST,
  returnAmount: u<Token>,
  maxSpread: Rate,
): CT {
  const rate = big(1).minus(maxSpread).toFixed() as Rate;

  const beliefPrice = divWithDefault(
    microfy(ustAmount),
    returnAmount,
    0,
  ).toFixed() as UST;

  const expectedAmountCT = microfy(ustAmount).div(beliefPrice) as u<CT<Big>>;

  const minReceivedCT = demicrofy(
    expectedAmountCT.mul(rate).toFixed(0) as u<CT>,
  ).toFixed();

  return minReceivedCT as CT;
}

export function computeMinReceivedUUST(
  tokenAmount: u<CT>,
  returnAmount: u<UST>,
  maxSpread: Rate,
): u<UST> {
  const rate = big(1).minus(maxSpread).toFixed() as Rate;

  const beliefPrice = divWithDefault(
    microfy(tokenAmount),
    returnAmount,
    0,
  ).toFixed() as CT;

  const expectedAmountUust = microfy(tokenAmount).div(beliefPrice) as u<
    UST<Big>
  >;

  return expectedAmountUust.mul(rate).toFixed(0) as u<UST>;
}
