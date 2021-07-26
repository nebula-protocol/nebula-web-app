import { CW20Addr, HumanAddr, rs } from './common';

export namespace staking {
  // ---------------------------------------------
  // HandleMsg
  // ---------------------------------------------
  export interface Unbond {
    asset_token: HumanAddr;
    // TODO set token type to amount
    amount: rs.Uint128;
  }

  export interface Withdraw {
    asset_token?: HumanAddr;
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
  }

  export interface PoolInfo {
    pool_info: {
      // TODO is this CW20Addr or HumanAddr?
      asset_token: CW20Addr;
    };
  }

  export interface PoolInfoResponse {
    asset_token: HumanAddr;
    staking_token: HumanAddr;
    // TODO set token type to total_bond_amount
    total_bond_amount: rs.Uint128;
    reward_index: rs.Decimal;
    // TODO set token type to pending_reward
    pending_reward: rs.Uint128;
  }

  export interface RewardInfo {
    reward_info: {
      staker_addr: HumanAddr;
      asset_token?: HumanAddr;
    };
  }

  export interface RewardInfoResponse {
    staker_addr: HumanAddr;
    reward_infos: Array<{
      asset_token: HumanAddr;
      // TODO set token type to bond_amount
      bond_amount: rs.Uint128;
      // TODO set token type to pending_reward
      pending_reward: rs.Uint128;
    }>;
  }
}
