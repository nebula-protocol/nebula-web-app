import { HumanAddr, OrderBy, Rate, rs, u } from '@libs/types';
import { NEB } from '../tokens';

export namespace gov {
  export enum VoteOption {
    Yes = 'yes',
    No = 'no',
    Abstain = 'abstain',
  }

  export enum PollStatus {
    InProgress = 'in_progress',
    Passed = 'passed',
    Rejected = 'rejected',
    Executed = 'executed',
    Expired = 'expired',
  }

  export interface ExecuteMsg {
    contract: HumanAddr;
    msg: string; // Binary -> JSON.parse(atob(msg));
  }

  export interface VoterInfo {
    vote: VoteOption;
    balance: u<NEB<rs.Uint128>>;
  }

  // ---------------------------------------------
  // CW20 HookMsg
  // ---------------------------------------------
  export interface StakeVotingTokens {
    stake_voting_tokens: {
      lock_for_weeks?: number;
    };
  }

  export interface CreatePoll {
    create_poll: {
      title: string;
      description: string;
      link?: string;
      execute_msgs?: ExecuteMsg[];
    };
  }

  export interface DepositReward {
    deposit_reward: {};
  }

  // ---------------------------------------------
  // HandleMsg
  // ---------------------------------------------
  export interface UpdateConfig {
    update_config: {
      owner?: HumanAddr;
      quorum?: rs.Decimal;
      threshold?: rs.Decimal;
      voting_period?: rs.u64;
      effective_delay?: rs.u64;
      expiration_period?: rs.u64;
      proposal_deposit?: u<NEB<rs.Uint128>>;
      // TODO is this token?
      voter_weight?: rs.Decimal;
      snapshot_period?: rs.u64;
    };
  }

  export interface CastVote {
    cast_vote: {
      poll_id: rs.u64;
      vote: VoteOption;
      // TODO set token type to amount
      amount: rs.Uint128;
    };
  }

  export interface WithdrawVotingTokens {
    withdraw_voting_tokens: {
      amount?: rs.Uint128;
    };
  }

  export interface WithdrawVotingRewards {
    withdraw_voting_rewards: {};
  }

  export interface EndPoll {
    end_poll: {
      poll_id: rs.u64;
    };
  }

  export interface ExecutePoll {
    execute_poll: {
      poll_id: rs.u64;
    };
  }

  export interface ExpirePoll {
    expire_poll: {
      poll_id: rs.u64;
    };
  }

  export interface SnapshotPoll {
    snapshot_poll: {
      poll_id: rs.u64;
    };
  }

  export interface IncreaseLockTime {
    increase_lock_time: {
      increase_weeks: rs.u64;
    };
  }

  // ---------------------------------------------
  // QueryMsg
  // ---------------------------------------------
  export interface Config {
    config: {};
  }

  export interface ConfigResponse {
    owner: HumanAddr;
    nebula_token: HumanAddr;
    quorum: Rate<rs.Decimal>;
    threshold: Rate<rs.Decimal>;
    voting_period: rs.u64;
    effective_delay: rs.u64;
    expiration_period: rs.u64;
    proposal_deposit: u<NEB<rs.Uint128>>;
    voter_weight: rs.Decimal;
    snapshot_period: rs.u64;
  }

  export interface State {
    state: {};
  }

  export interface StateResponse {
    poll_count: rs.u64;
    total_share: u<NEB<rs.Uint128>>;
    total_deposit: u<NEB<rs.Uint128>>;
    // TODO set token type to pending_voting_rewards
    pending_voting_rewards: rs.Uint128;
  }

  export interface Staker {
    staker: {
      address: HumanAddr;
    };
  }

  export interface StakerResponse {
    balance: u<NEB<rs.Uint128>>;
    share: u<NEB<rs.Uint128>>;
    /** Array<[ poll_id, VoterInfo ]> */
    locked_balance: Array<[rs.u64, VoterInfo]>;
    pending_voting_rewards: u<NEB<rs.Uint128>>;
    lock_end_week?: rs.u64;
  }

  export interface VotingPower {
    voting_power: {
      address: HumanAddr;
    };
  }

  export interface VotingPowerResponse {
    staker: HumanAddr;
    voting_power: rs.FPDecimal;
  }

  export interface Poll {
    poll: {
      poll_id: rs.u64;
    };
  }

  export interface PollResponse {
    id: rs.u64;
    creator: HumanAddr;
    status: PollStatus;
    end_time: rs.u64;
    title: string;
    description: string;
    link?: string;
    // TODO set token type to deposit_amount
    deposit_amount: rs.Uint128;
    execute_data?: ExecuteMsg[];
    yes_votes: u<NEB<rs.Uint128>>; // balance
    no_votes: u<NEB<rs.Uint128>>; // balance
    abstain_votes: u<NEB<rs.Uint128>>; // balance
    total_balance_at_end_poll?: u<NEB<rs.Uint128>>;
    // TODO set token type to voters_reward
    voters_reward: rs.Uint128;
    // TODO set token type to staked_amount
    staked_amount?: u<NEB<rs.Uint128>>;
  }

  export interface Polls {
    polls: {
      filter?: PollStatus;
      start_after?: rs.u64;
      limit?: rs.u32;
      order_by?: OrderBy;
    };
  }

  export interface PollsResponse {
    polls: PollResponse[];
  }

  export interface Voters {
    voters: {
      poll_id: rs.u64;
      start_after?: HumanAddr;
      limit?: rs.u32;
      order_by?: OrderBy;
    };
  }

  export interface VotersResponse {
    voters: Array<{
      voter: HumanAddr;
      vote: VoteOption;
      balance: u<NEB<rs.Uint128>>;
    }>;
  }

  export interface Shares {
    shares: {
      start_after?: HumanAddr;
      limit?: rs.u32;
      order_by?: OrderBy;
    };
  }

  export interface SharesResponse {
    stakers: Array<{
      staker: HumanAddr;
      share: rs.Uint128;
    }>;
  }
}
