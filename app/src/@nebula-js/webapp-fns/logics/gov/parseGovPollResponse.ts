import { formatRate } from '@nebula-js/notation';
import { cw20, gov, NEB, Rate, u } from '@nebula-js/types';
import big from 'big.js';

export interface ParsedPoll {
  poll: gov.PollResponse;

  status: string;

  inProgressOver: boolean;

  votes: {
    yes: u<NEB>;
    yesRatio: Rate;
    no: u<NEB>;
    noRatio: Rate;
    abstain: u<NEB>;
    abstainRatio: Rate;
    total: u<NEB>;
    threshold: u<NEB>;
  };

  quorum: {
    current: Rate;
    gov: Rate;
  };

  baseline: {
    label: string;
    value: Rate;
  };

  endsIn: Date;
}

export function parseGovPollResponse(
  poll: gov.PollResponse,
  govNebBalance: cw20.BalanceResponse<NEB>,
  govState: gov.StateResponse,
  govConfig: gov.ConfigResponse,
  blockHeight: number,
): ParsedPoll {
  const votesTotal: u<NEB> =
    poll.status !== 'in_progress' && poll.total_balance_at_end_poll
      ? poll.total_balance_at_end_poll
      : poll.staked_amount
      ? poll.staked_amount
      : (big(govNebBalance.balance)
          .minus(govState.total_deposit)
          .toFixed() as u<NEB>);

  const votesThreshold = big(
    big(poll.yes_votes).plus(poll.no_votes).plus(poll.abstain_votes),
  )
    .mul(govConfig.threshold)
    .toFixed() as u<NEB>;

  const quorumCurrent = big(
    big(poll.yes_votes).plus(poll.no_votes).plus(poll.abstain_votes),
  )
    .div(votesTotal)
    .toFixed() as Rate;

  const endsIn = new Date((poll.end_height - blockHeight) * 6000 + Date.now());

  const inProgressOver = poll.status === 'in_progress' && endsIn <= new Date();

  return {
    poll,

    status:
      poll.status === 'in_progress'
        ? 'In Progress'
        : poll.status === 'passed'
        ? 'Passed'
        : poll.status === 'rejected'
        ? 'Rejected'
        : poll.status === 'executed'
        ? 'Executed'
        : poll.status === 'expired'
        ? 'Expired'
        : 'Unknown Status',

    inProgressOver,

    votes: {
      yes: poll.yes_votes,
      yesRatio: big(poll.yes_votes).div(votesTotal).toFixed() as Rate,
      no: poll.no_votes,
      noRatio: big(poll.no_votes).div(votesTotal).toFixed() as Rate,
      abstain: poll.abstain_votes,
      abstainRatio: big(poll.abstain_votes).div(votesTotal).toFixed() as Rate,
      total: votesTotal,
      threshold: votesThreshold,
    },

    quorum: {
      current: quorumCurrent,
      gov: govConfig.quorum,
    },

    baseline: big(quorumCurrent).gt(govConfig.quorum)
      ? {
          label: 'Pass Threshold',
          value: big(big(votesThreshold).div(votesTotal))
            .mul(votesTotal)
            .toFixed() as Rate,
        }
      : {
          label: `Quorum ${formatRate(govConfig.quorum)}%`,
          value: big(govConfig.quorum).mul(votesTotal).toFixed() as Rate,
        },

    endsIn,
  };
}
