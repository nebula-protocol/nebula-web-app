import { gov } from '@nebula-js/types';

export function pickGovPollVoted(
  govStaker: gov.StakerResponse | undefined,
  pollId: number | undefined,
): gov.VoterInfo | undefined {
  if (!govStaker || !pollId) {
    return undefined;
  }

  for (const [id, voterInfo] of govStaker.locked_balance) {
    if (pollId === id) {
      return voterInfo;
    }
  }

  return undefined;
}
