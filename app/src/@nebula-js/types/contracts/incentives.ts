import { HumanAddr, rs, terraswap, Token } from '@libs/types';

export namespace incentives {
  // ---------------------------------------------
  // HandleMsg
  // ---------------------------------------------
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
