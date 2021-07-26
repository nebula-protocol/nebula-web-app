import { Token } from '../tokens';
import { HumanAddr, rs } from './common';
import { terraswap } from './terraswap';

export namespace incentives {
  // ---------------------------------------------
  // HandleMsg
  // ---------------------------------------------
  export interface Withdraw {}

  export interface NewPenaltyPeriod {}

  export interface SendAll {
    send_all: {
      asset_infos: Array<terraswap.AssetInfo>;
      send_to: HumanAddr;
    };
  }

  export interface SwapAll {
    swap_all: {
      terraswap_pair: HumanAddr;
      cluster_token: HumanAddr;
      to_ust: boolean;
    };
  }

  export interface RecordTerraswapImpact {
    record_terraswap_impact: {
      arbitrager: HumanAddr;
      terraswap_pair: HumanAddr;
      cluster_contract: HumanAddr;
      pool_before: terraswap.pair.PoolResponse<Token, Token>;
    };
  }

  export interface ArbClusterMint {
    arb_cluster_mint: {
      cluster_contract: HumanAddr;
      assets: Array<terraswap.Asset<Token>>;
    };
  }

  export interface ArbClusterRedeem {
    arb_cluster_redeem: {
      cluster_contract: HumanAddr;
      // TODO is this type correct?
      asset: terraswap.Asset<Token>;
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
  }
}
