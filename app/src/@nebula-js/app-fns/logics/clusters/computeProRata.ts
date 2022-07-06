import { divWithDefault, sum } from '@libs/big-math';
import { formatFluidDecimalPoints } from '@libs/formatter';
import { u, Token } from '@nebula-js/types';

/**
 * @param weights targets (mint), inventories (burn)
 * @param inputAmount input amount of asset
 * @param idx index of input in weight list
 */
export function computeProRata(
  weights: u<Token>[],
  inputAmount: Token,
  idx: number,
): Token[] {
  if (weights.length <= idx) {
    return Array(weights.length).fill('0');
  }

  const weightSum = sum(...weights);
  const idxRatio = divWithDefault(weights[idx], weightSum, 0);

  return weights.map((weight, _idx) => {
    if (inputAmount.length === 0) return '' as u<Token>;

    if (idx === _idx) return inputAmount;

    const eachRatio = divWithDefault(weight, weightSum, 0);

    return formatFluidDecimalPoints(
      divWithDefault(inputAmount, idxRatio, 0).mul(eachRatio),
      6,
      { delimiter: false },
    ) as u<Token>;
  });
}
