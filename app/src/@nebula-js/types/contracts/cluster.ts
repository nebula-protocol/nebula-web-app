import { CT, Token, u, UST } from '../tokens';
import { Rate } from '../units';
import { CW20Addr, HumanAddr, rs } from './common';
import { terraswap } from './terraswap';

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
      composition_oracle?: HumanAddr;
      penalty?: HumanAddr;
      // TODO is Asset type CT or Token?
      target?: terraswap.Asset<Token>[]; // recomp oracle
    };
  }

  export interface UpdateTarget {
    update_target: {
      // TODO is Asset type CT or Token?
      target: terraswap.Asset<Token>[];
    };
  }

  export interface RevokeAsset {
    revoke_asset: {};
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
    // TODO is this CW20Addr or HumanAddr?
    cluster_token?: CW20Addr;
    factory: HumanAddr;
    pricing_oracle: HumanAddr;
    composition_oracle: HumanAddr;
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
    target: rs.u32[];
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
    inv: Rate<rs.Uint128>[];
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
