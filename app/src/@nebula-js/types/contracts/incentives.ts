import { CT, u, UST } from '../tokens';
import { HumanAddr, rs } from './common';
import { terraswap } from './terraswap';

export namespace incentives {
  export interface PoolResponse {
    // TODO is this type correct?
    assets: terraswap.Asset<u<CT>, u<UST>>;
    // TODO set token type to total_share
    total_share: rs.Uint128;
  }

  // ---------------------------------------------
  // HandleMsg
  // ---------------------------------------------
  export interface Withdraw {}

  export interface NewPenaltyPeriod {}

  export interface SendAll {
    asset_infos: Array<terraswap.AssetInfo>;
    send_to: HumanAddr;
  }

  export interface SwapAll {
    terraswap_pair: HumanAddr;
    cluster_token: HumanAddr;
    to_ust: boolean;
  }

  export interface RecordTerraswapImpact {
    arbitrager: HumanAddr;
    terraswap_pair: HumanAddr;
    cluster_contract: HumanAddr;
    pool_before: PoolResponse;
  }

  export interface ArbClusterMint {
    cluster_contract: HumanAddr;
    // TODO is this type correct?
    assets: Array<terraswap.Asset<u<CT>, u<UST>>>;
  }

  export interface ArbClusterRedeem {
    cluster_contract: HumanAddr;
    // TODO is this type correct?
    asset: terraswap.Asset<u<CT>, u<UST>>;
  }

  export interface Mint {
    cluster_contract: HumanAddr;
    // TODO is this type correct?
    asset_amounts: Array<terraswap.Asset<u<CT>, u<UST>>>;
    min_tokens?: rs.Uint128;
  }

  export interface Redeem {
    cluster_contract: HumanAddr;
    max_tokens: rs.Uint128;
    // TODO is this type correct?
    asset_amounts?: Array<terraswap.Asset<u<CT>, u<UST>>>;
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
