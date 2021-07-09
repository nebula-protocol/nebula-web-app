import { DateTime } from '@nebula-js/types/units';
import { HumanAddr, rs } from './common';
import { terraswap } from './terraswap';

export namespace cluster_factory {
  export interface Params {
    /** Name of cluster */
    name: string;

    /** Symbol of cluster */
    symbol: string;

    /** Distribution weight (default is 30, which is 1/10 of NEB distribution weight) */
    weight?: rs.u32;

    /** Corresponding penalty contract to query for mint/redeem */
    penalty: HumanAddr;

    /** Pricing oracle address */
    pricing_oracle: HumanAddr;

    /** Composition oracle address */
    composition_oracle: HumanAddr;

    assets: terraswap.AssetInfo[];

    target: rs.u32[];
  }

  // ---------------------------------------------
  // HandleMsg
  // ---------------------------------------------
  export interface PostInitialize {
    owner: HumanAddr;
    terraswap_factory: HumanAddr;
    nebula_token: HumanAddr;
    staking_contract: HumanAddr;
    oracle_contract: HumanAddr;
    commission_collector: HumanAddr;
  }

  export interface UpdateConfig {
    owner?: HumanAddr;
    token_code_id?: rs.u64;
    cluster_code_id?: rs.u64;
    // TODO set token type to distribution_amount
    distribution_schedule?: Array<
      [
        start_time: DateTime,
        end_time: DateTime,
        distribution_amount: rs.Uint128,
      ]
    >;
  }

  export interface UpdateWeight {
    asset_token: HumanAddr;
    weight: rs.u32;
  }

  export interface CreateCluster {
    /** used to create all necessary contract or register asset */
    params: Params;
  }

  export interface PassCommand {
    contract_addr: HumanAddr;
    // TODO what is Binary type? Base64 encoded string?
    msg: unknown; // Binary,
  }

  export interface Distribute {}

  // ---------------------------------------------
  // QueryMsg
  // ---------------------------------------------
  export interface Config {
    config: {};
  }

  export interface ConfigResponse {
    owner: HumanAddr;
    nebula_token: HumanAddr;
    staking_contract: HumanAddr;
    commission_collector: HumanAddr;
    protocol_fee_rate: string;
    oracle_contract: HumanAddr;
    terraswap_factory: HumanAddr;
    token_code_id: rs.u64;
    cluster_code_id: rs.u64;
    base_denom: string;
    // TODO are they DateTime?
    genesis_time: DateTime;
    // TODO set token type to distribution_amount
    distribution_schedule: Array<
      [
        start_time: DateTime,
        end_time: DateTime,
        distribution_amount: rs.Uint128,
      ]
    >;
  }

  export interface ClusterExists {
    cluster_exists: {
      contract_addr: HumanAddr;
    };
  }

  export interface ClusterExistsResponse {
    exists: boolean;
  }

  export interface ClusterList {
    cluster_list: {};
  }

  export interface ClusterListResponse {
    contract_addrs: HumanAddr[];
  }

  // TODO there is no this type
  export interface DistributionInfo {
    distribution_info: {};
  }

  export interface DistributionInfoResponse {
    weights: Array<[HumanAddr, rs.u32]>;
    last_distributed: rs.u64;
  }
}
