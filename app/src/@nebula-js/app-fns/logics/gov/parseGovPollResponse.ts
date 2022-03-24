import { formatRate } from '@libs/formatter';
import { NebulaContractAddress } from '@nebula-js/app-provider';
import {
  cluster,
  cluster_factory,
  community,
  cw20,
  gov,
  HumanAddr,
  NEB,
  Rate,
  u,
} from '@nebula-js/types';
import big from 'big.js';

export interface ParsedExecuteMsg {
  contract: HumanAddr;
  msg:
    | cluster_factory.CreateCluster // whitelist cluster
    | cluster_factory.DecommissionCluster // blacklist cluster
    | cluster.UpdateConfig // cluster parameter change
    | gov.UpdateConfig // governance parameter change
    | community.Spend; // community pool spend
}

export interface ParsedPoll {
  poll: gov.PollResponse;

  status: string;

  inProgressTimeover: boolean;

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

  type: string;

  executeMsgs: ParsedExecuteMsg[] | undefined;
}

export function parseGovPollResponse(
  poll: gov.PollResponse,
  govNebBalance: cw20.BalanceResponse<NEB>,
  govState: gov.StateResponse,
  govConfig: gov.ConfigResponse,
  contractAddress: NebulaContractAddress,
  blockHeight: number,
): ParsedPoll {
  const _votesTotal: u<NEB> =
    poll.status !== 'in_progress' && poll.total_balance_at_end_poll
      ? poll.total_balance_at_end_poll
      : poll.staked_amount
      ? poll.staked_amount
      : (big(govNebBalance.balance)
          .minus(govState.total_deposit)
          .toFixed() as u<NEB>);

  // FIXME pool is 0
  const votesTotal: u<NEB> = big(_votesTotal).gt(0)
    ? _votesTotal
    : ('1' as u<NEB>);

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

  const endsIn = new Date(poll.end_time * 1000);

  const inProgressOver = poll.status === 'in_progress' && endsIn <= new Date();

  const executeMsgs: ParsedExecuteMsg[] | undefined = poll.execute_data
    ? poll.execute_data.map((data) => parseExecuteMsg(data))
    : undefined;

  return {
    poll,

    status:
      poll.status === 'in_progress'
        ? endsIn <= new Date()
          ? 'Poll Ended'
          : 'In Progress'
        : poll.status === 'passed'
        ? 'Passed'
        : poll.status === 'rejected'
        ? 'Rejected'
        : poll.status === 'executed'
        ? 'Executed'
        : poll.status === 'expired'
        ? 'Expired'
        : 'Failed',

    inProgressTimeover: inProgressOver,

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

    type: parsePollType(executeMsgs, contractAddress),

    executeMsgs,
  };
}

function parseExecuteMsg(executeMsg: gov.ExecuteMsg): ParsedExecuteMsg {
  let msg: any = {};
  try {
    msg = JSON.parse(Buffer.from(executeMsg.msg, 'base64').toString('binary'));
  } catch (error) {}

  return {
    contract: executeMsg.contract,
    msg,
  };
}

function parsePollType(
  executeMsgs: ParsedExecuteMsg[] | undefined,
  address: NebulaContractAddress,
): string {
  if (!executeMsgs || executeMsgs.length === 0) {
    return 'Text Poll';
  }

  if (executeMsgs.length >= 2) {
    return 'Custom Poll';
  }

  // Only support the poll that is created with one execute msg.
  const executeMsg = executeMsgs[0];

  if (
    executeMsg.contract === address.clusterFactory &&
    'create_cluster' in executeMsg.msg
  ) {
    return 'Whitelist Cluster';
  } else if (
    executeMsg.contract === address.clusterFactory &&
    'decommission_cluster' in executeMsg.msg
  ) {
    return 'Blacklist Cluster';
  } else if (
    executeMsg.contract === address.gov &&
    'update_config' in executeMsg.msg
  ) {
    return 'Governance Parameter Change';
  } else if (
    executeMsg.contract === address.community &&
    'spend' in executeMsg.msg
  ) {
    return 'Community Pool spend';
  } else if (
    executeMsg.contract !== address.gov &&
    'update_config' in executeMsg.msg
  ) {
    return 'Cluster Parameter Change';
  } else if (
    executeMsg.contract === address.clusterFactory &&
    'update_weight' in executeMsg.msg
  ) {
    return 'Cluster Factory Distribution Weight Change';
  } else {
    console.log(executeMsg, address);
    return 'Unknown Poll';
  }
}
