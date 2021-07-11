import { u, NEB } from '@nebula-js/types/tokens';
import { HumanAddr, OrderBy, rs } from './common';

export namespace gov {
  export enum VoteOption {
    Yes = 'Yes',
    No = 'No',
    Abstain = 'Abstain',
  }

  export enum PollStatus {
    InProgress = 'InProgress',
    Passed = 'Passed',
    Rejected = 'Rejected',
    Executed = 'Executed',
    Expired = 'Expired',
  }

  export interface ExecuteMsg {
    contract: HumanAddr;
    // TODO ?
    msg: unknown; // Binary;
  }

  export interface VoterInfo {
    vote: VoteOption;
    // TODO set token type to balance
    balance: rs.Uint128;
  }

  // ---------------------------------------------
  // HandleMsg
  // ---------------------------------------------
  export interface UpdateConfig {
    owner?: HumanAddr;
    quorum?: rs.Decimal;
    threshold?: rs.Decimal;
    voting_period?: rs.u64;
    effective_delay?: rs.u64;
    expiration_period?: rs.u64;
    // TODO set token type to proposal_deposit
    proposal_deposit?: rs.Uint128;
    // TODO is this token?
    voter_weight?: rs.Decimal;
    snapshot_period?: rs.u64;
  }

  export interface CastVote {
    poll_id: rs.u64;
    vote: VoteOption;
    // TODO set token type to amount
    amount: rs.Uint128;
  }

  export interface WithdrawVotingTokens {
    amount?: rs.Uint128;
  }

  export interface WithdrawVotingRewards {}

  export interface StakeVotingRewards {}

  export interface EndPoll {
    poll_id: rs.u64;
  }

  export interface ExecutePoll {
    poll_id: rs.u64;
  }

  export interface ExpirePoll {
    poll_id: rs.u64;
  }

  export interface SnapshotPoll {
    poll_id: rs.u64;
  }

  export interface IncreaseLockTime {
    increase_weeks: rs.u64;
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
    quorum: rs.Decimal;
    threshold: rs.Decimal;
    voting_period: rs.u64;
    effective_delay: rs.u64;
    expiration_period: rs.u64;
    proposal_deposit: rs.Uint128;
    voter_weight: rs.Decimal;
    snapshot_period: rs.u64;
  }

  export interface State {
    state: {};
  }

  export interface StateResponse {
    poll_count: rs.u64;
    total_share: u<NEB<rs.Uint128>>;
    // TODO set token type to total_deposit
    total_deposit: rs.Uint128;
    // TODO set token type to pending_voting_rewards
    pending_voting_rewards: rs.Uint128;
  }

  export interface Staker {
    staker: {
      address: HumanAddr;
    };
  }

  export interface StakerResponse {
    // TODO set token type to balance
    balance: rs.Uint128;
    // TODO set token type to share
    share: rs.Uint128;
    locked_balance: Array<[rs.u64, VoterInfo]>;
    // TODO set token type to pending_voting_rewards
    pending_voting_rewards: rs.Uint128;
    lock_end_week?: rs.u64;
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
    end_height: rs.u64;
    title: String;
    description: String;
    link?: String;
    // TODO set token type to deposit_amount
    deposit_amount: rs.Uint128;
    execute_data?: ExecuteMsg;
    yes_votes: u<NEB<rs.Uint128>>; // balance
    no_votes: u<NEB<rs.Uint128>>; // balance
    abstain_votes: u<NEB<rs.Uint128>>; // balance
    // TODO set token type to total_balance_at_end_poll
    total_balance_at_end_poll?: rs.Uint128;
    // TODO set token type to voters_reward
    voters_reward: rs.Uint128;
    // TODO set token type to staked_amount
    staked_amount?: rs.Uint128;
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
      // TODO set token type to balance
      balance: rs.Uint128;
    }>;
  }
}
