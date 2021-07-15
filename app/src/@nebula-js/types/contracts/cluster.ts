import { CT, u, UST } from '../tokens';
import { Rate } from '../units';
import { CW20Addr, HumanAddr, rs } from './common';
import { terraswap } from './terraswap';

export namespace cluster {
  // ---------------------------------------------
  // HandleMsg
  // ---------------------------------------------
  export interface ResetCompositionOracle {
    composition_oracle: HumanAddr;
  }

  export interface ResetTarget {
    assets: terraswap.AssetInfo[];
    target: rs.u32[];
  }

  export interface ResetPenalty {
    penalty: HumanAddr;
  }

  export interface Mint {
    // TODO is this type correct?
    asset_amounts: terraswap.Asset<u<CT>>[];
    min_tokens?: rs.Uint128[];
  }

  export interface Burn {
    max_tokens: rs.Uint128;
    // TODO is this type correct?
    asset_amounts?: terraswap.Asset<u<CT>>[];
  }

  // ---------------------------------------------
  // QueryMsg
  // ---------------------------------------------
  export interface ClusterConfig {
    name: string;
    owner: HumanAddr;
    // TODO is this CW20Addr or HumanAddr?
    cluster_token?: CW20Addr;
    factory: HumanAddr;
    pricing_oracle: HumanAddr;
    composition_oracle: HumanAddr;
    penalty: HumanAddr;
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
    assets: terraswap.AssetInfo[];
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
    assets: terraswap.AssetInfo[];
    penalty: HumanAddr;
    // TODO is this CW20Addr or HumanAddr?
    cluster_token: CW20Addr;
    target: rs.u32[];
    cluster_contract_address: HumanAddr;
  }
}
