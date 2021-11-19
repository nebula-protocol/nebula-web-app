import {
  computeRemainingLockedWeeks,
  computeVotingPower,
} from '../computeVotingPower';

describe('computeVoingPower.ts', () => {
  describe('computeRemainingLockedWeeks()', () => {
    describe('when 2 weeks left', () => {
      test('should return 2', () => {
        // given
        Date.now = jest.fn(() => Date.parse('2022-01-01'));
        const lockEndWeek = 2715; // 2715 = 2022-01-15 to weeks
        // when
        const result = computeRemainingLockedWeeks(lockEndWeek);
        // then
        expect(result).toBe(2);
      });
    });
  });

  describe('computeVotingPower()', () => {
    describe('when remaining locked weeks left 2 years', () => {
      test('should return voting power', () => {
        // given
        const stackedNEBTokens = 1000;
        const remainingLockedWeeks = 104;
        // when
        const result = computeVotingPower(
          stackedNEBTokens,
          remainingLockedWeeks,
        );
        // then
        expect(result).toBe('1000');
      });
    });

    describe('when remaining locked weeks left 1 years', () => {
      test('should return voting power', () => {
        // given
        const stackedNEBTokens = 1000;
        const remainingLockedWeeks = 52;
        // when
        const result = computeVotingPower(
          stackedNEBTokens,
          remainingLockedWeeks,
        );
        // then
        expect(result).toBe('500');
      });
    });
  });
});
