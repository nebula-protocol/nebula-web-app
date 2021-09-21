import { gov, Rate } from '@nebula-js/types';
import { sum } from '@libs/big-math';
import { Big } from 'big.js';

export function computeGovPollQuorum(
  poll: gov.PollResponse,
  state: gov.StateResponse,
) {
  return sum(poll.yes_votes, poll.no_votes, poll.abstain_votes).div(
    state.total_share,
  ) as Rate<Big>;
}
