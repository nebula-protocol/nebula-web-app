import { HumanAddr, rs, terraswap, Token, u, UST } from '@libs/types';
import { CT, NEB } from '@nebula-js/types';

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
  export interface ArbClusterCreate {
    arb_cluster_create: {
      cluster_contract: HumanAddr;
      assets: Array<terraswap.Asset<Token>>;
      min_ust?: u<UST>;
    };
  }

  export interface ArbClusterRedeem {
    arb_cluster_redeem: {
      cluster_contract: HumanAddr;
      asset: terraswap.Asset<Token>;
      min_cluster?: u<CT>;
    };
  }

  export interface IncentivesCreate {
    incentives_create: {
      cluster_contract: HumanAddr;
      // TODO is this type correct?
      asset_amounts: Array<terraswap.Asset<Token>>;
      min_tokens?: rs.Uint128;
    };
  }

  export interface IncentivesRedeem {
    incentives_redeem: {
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
    base_denom: string;
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
    pending_rewards: u<NEB>;
  }
}
