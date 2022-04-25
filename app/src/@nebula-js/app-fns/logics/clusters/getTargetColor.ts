import big, { Big } from 'big.js';

const DIFF_THRESHOLD = big(0.0001);

// portfolio < target = #f15e7e
// portfolio > target = #23bed9
// |target - portfolio| < 0.01% = var(--color-white64)

export function getTargetColor(targetRatio: Big, portfolioRatio: Big): string {
  const diff = portfolioRatio.minus(targetRatio);

  return diff.abs().gte(DIFF_THRESHOLD)
    ? diff.gt(0)
      ? 'var(--color-blue01)'
      : 'var(--color-red01)'
    : 'var(--color-white64)';
}
