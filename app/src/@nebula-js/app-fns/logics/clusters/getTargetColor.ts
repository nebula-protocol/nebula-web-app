import big, { Big } from 'big.js';

const DIFF_THRESHOLD = big(0.0001);

// portfolio < target = #23bed9
// portfolio > target = #f15e7e
// |target - portfolio| < 0.01% = var(--color-white80)

export function getTargetColor(targetRatio: Big, portfolioRatio: Big): string {
  const diff = portfolioRatio.minus(targetRatio);

  return diff.abs().gte(DIFF_THRESHOLD)
    ? diff.gt(0)
      ? 'var(--color-red01)'
      : 'var(--color-blue01)'
    : 'var(--color-white80)';
}
