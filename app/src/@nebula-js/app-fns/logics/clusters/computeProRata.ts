import { divWithDefault, sum } from '@libs/big-math';
import { formatFluidDecimalPoints } from '@libs/formatter';
import { u, Token } from '@nebula-js/types';

export function computeProRata(
  inventories: u<Token>[],
  inputAmount: Token,
  idx: number,
): Token[] {
  if (inventories.length < idx) {
    console.error('inventories:', inventories, ' index: ', idx);
    return Array(inventories.length).fill('0');
  }

  const invSum = sum(...inventories);
  const idxRatio = divWithDefault(inventories[idx], invSum, 0);

  return inventories.map((inv, _idx) => {
    if (inputAmount.length === 0) return '' as u<Token>;

    if (idx === _idx) return inputAmount;

    const eachRatio = divWithDefault(inv, invSum, 0);

    return formatFluidDecimalPoints(
      divWithDefault(inputAmount, idxRatio, 0).mul(eachRatio),
      6,
      { delimiter: false },
    ) as u<Token>;
  });
}
