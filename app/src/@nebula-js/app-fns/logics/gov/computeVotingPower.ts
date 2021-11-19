import { NEB } from '../../../types';

const TWO_YEAR_WEEKS = 104;

const computeRemainingLockedWeeks = (lockEndWeek: number | undefined) => {
  return lockEndWeek
    ? lockEndWeek - Math.floor(Date.now() / (1000 * 60 * 60 * 24 * 7))
    : 0;
};

const computeVotingPower = (
  stakedTokenAmount: number,
  remainingLockedWeeks: number,
): NEB => {
  return Math.floor(
    (stakedTokenAmount * remainingLockedWeeks) / TWO_YEAR_WEEKS,
  ).toString() as NEB;
};

export { computeVotingPower, computeRemainingLockedWeeks };
