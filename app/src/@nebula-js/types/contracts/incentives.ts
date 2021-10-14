import { HumanAddr, rs, terraswap, Token } from '@libs/types';

export namespace incentives {
  // ---------------------------------------------
  // CW20 HookMsg
  // ---------------------------------------------
  export interface DepositReward {
    deposit_reward: {
      rewards: Array<[rs.u16, HumanAddr, rs.Uint128]>;
    };
  }

  // ---------------------------------------------
  // HandleMsg
  // ---------------------------------------------
  export interface ArbClusterMint {
    arb_cluster_mint: {
      cluster_contract: HumanAddr;
      assets: Array<terraswap.Asset<Token>>;
      min_ust?: rs.Uint128;
    };
  }

  export interface ArbClusterRedeem {
    arb_cluster_redeem: {
      cluster_contract: HumanAddr;
      // TODO is this type correct?
      asset: terraswap.Asset<Token>;
      min_cluster?: rs.Uint128;
    };
  }

  export interface Mint {
    mint: {
      cluster_contract: HumanAddr;
      // TODO is this type correct?
      asset_amounts: Array<terraswap.Asset<Token>>;
      min_tokens?: rs.Uint128;
    };
  }

  export interface Redeem {
    redeem: {
      cluster_contract: HumanAddr;
      max_tokens: rs.Uint128;
      // TODO is this type correct?
      asset_amounts?: Array<terraswap.Asset<Token>>;
    };
  }

  // ---------------------------------------------
  // QueryMsg
  // ---------------------------------------------
  export interface Config {
    config: {};
  }

  export interface ConfigResponse {
    factory: HumanAddr;
    terraswap_factory: HumanAddr;
    nebula_token: HumanAddr;
    base_denom: String;
    owner: HumanAddr;
    custody: HumanAddr;
  }

  export interface PenaltyPeriod {
    penalty_period: {};
  }

  export interface PenaltyPeriodResponse {
    n: rs.u64;
  }

  export interface PoolInfo {
    pool_info: {
      pool_type: rs.u16;
      cluster_address: HumanAddr;
      n?: rs.u64;
    };
  }

  // TODO there is no PoolInfoResponse

  export interface CurrentContributorInfo {
    current_contributor_info: {
      pool_type: rs.u16;
      contributor_address: HumanAddr;
      cluster_address: HumanAddr;
    };
  }

  export interface CurrentContributorInfoResponse {
    n: rs.u64;
    value_contributed: rs.Uint128;
  }

  export interface ContributorPendingRewards {
    contributor_pending_rewards: {
      contributor_address: HumanAddr;
    };
  }

  export interface ContributorPendingRewardsResponse {
    pending_rewards: rs.Uint128;
  }
}
