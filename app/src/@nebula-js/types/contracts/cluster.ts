import { CW20Addr, HumanAddr, rs, terraswap, Token, u, UST } from '@libs/types';
import { CT } from '../tokens';

export namespace cluster {
  // ---------------------------------------------
  // HandleMsg
  // ---------------------------------------------
  export interface UpdateConfig {
    update_config: {
      owner?: HumanAddr;
      name?: string;
      description?: string;
      cluster_token?: CW20Addr;
      pricing_oracle?: HumanAddr;
      target_oracle?: HumanAddr;
      penalty?: HumanAddr;
      target?: terraswap.Asset<Token>[]; // recomp oracle
    };
  }

  export interface UpdateTarget {
    update_target: {
      target: terraswap.Asset<Token>[];
    };
  }

  export interface Decommission {
    decommission: {};
  }

  export interface Mint {
    mint: {
      // TODO is this type correct?
      asset_amounts: terraswap.Asset<CT>[];
      min_tokens?: rs.Uint128[];
    };
  }

  export interface Burn {
    burn: {
      max_tokens: rs.Uint128;
      // TODO is this type correct?
      asset_amounts?: terraswap.Asset<CT>[];
    };
  }

  // ---------------------------------------------
  // QueryMsg
  // ---------------------------------------------
  export interface ClusterConfig {
    name: string;
    description: string;
    owner: HumanAddr;
    cluster_token?: CW20Addr;
    factory: HumanAddr;
    pricing_oracle: HumanAddr;
    target_oracle: HumanAddr;
    penalty: HumanAddr;
    active: boolean;
  }

  export interface Config {
    config: {};
  }

  export interface ConfigResponse {
    config: ClusterConfig;
  }

  export interface Target {
    target: {};
  }

  export interface TargetResponse {
    target: terraswap.Asset<Token>[];
  }

  export interface ClusterState {
    cluster_state: {
      cluster_contract_address: HumanAddr;
    };
  }

  export interface ClusterStateResponse {
    outstanding_balance_tokens: u<CT<rs.Uint128>>;
    // TODO is this UST? (not u<UST>)
    prices: UST[];
    inv: u<Token<rs.Uint128>>[];
    penalty: HumanAddr;
    // TODO is this CW20Addr or HumanAddr?
    cluster_token: CW20Addr;
    // TODO is this Token type CT?
    target: terraswap.Asset<Token>[];
    cluster_contract_address: HumanAddr;
    active: boolean;
  }

  export interface ClusterInfo {
    cluster_info: {};
  }

  export interface ClusterInfoResponse {
    name: string;
    description: string;
  }
}
