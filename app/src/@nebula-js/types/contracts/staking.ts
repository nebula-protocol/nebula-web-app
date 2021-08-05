import { LP, Token, u, UST } from '../tokens';
import { CW20Addr, HumanAddr, rs } from './common';
import { terraswap } from './terraswap';

export namespace staking {
  // ---------------------------------------------
  // HandleMsg
  // ---------------------------------------------
  export interface Unbond {
    unbond: {
      // TODO is this CW20Addr or HumanAddr?
      asset_token: CW20Addr;
      // TODO set token type to amount
      amount: u<LP<rs.Uint128>>;
    };
  }

  export interface Withdraw {
    withdraw: {
      // TODO is this CW20Addr or HumanAddr?
      asset_token?: CW20Addr;
    };
  }

  export interface AutoStake<A extends Token, B extends Token> {
    auto_stake: {
      assets: [terraswap.Asset<A>, terraswap.Asset<B>];
      slippage_tolerance?: rs.Decimal;
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
      /** cluster_token */
      asset_token?: CW20Addr;
    };
  }

  export interface RewardInfoResponse {
    staker_addr: HumanAddr;
    reward_infos: Array<{
      asset_token: CW20Addr;
      bond_amount: u<LP<rs.Uint128>>;
      // TODO set token type to pending_reward
      pending_reward: u<UST<rs.Uint128>>;
    }>;
  }
}
