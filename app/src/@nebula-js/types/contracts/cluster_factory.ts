import {
  CW20Addr,
  DateTime,
  HumanAddr,
  rs,
  terraswap,
  Token,
} from '@libs/types';

export namespace cluster_factory {
  export interface Params {
    /** Name of cluster */
    name: string;

    /** Symbol of cluster */
    symbol: string;

    /** Description of cluster */
    description: string;

    /** Distribution weight (default is 30, which is 1/10 of NEB distribution weight) */
    weight?: rs.u32;

    /** Corresponding penalty contract to query for mint/redeem */
    penalty: HumanAddr;

    /** Pricing oracle address */
    pricing_oracle: HumanAddr;

    /** Composition oracle address */
    target_oracle: HumanAddr;

    /** Target assets and weights */
    target: terraswap.Asset<Token>[];
  }

  // ---------------------------------------------
  // HandleMsg
  // ---------------------------------------------
  export interface PostInitialize {
    post_initialize: {
      owner: HumanAddr;
      terraswap_factory: HumanAddr;
      nebula_token: HumanAddr;
      staking_contract: HumanAddr;
      commission_collector: HumanAddr;
    };
  }

  export interface UpdateConfig {
    update_config: {
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
    };
  }

  export interface UpdateWeight {
    update_weight: {
      asset_token: HumanAddr;
      weight: rs.u32;
    };
  }

  export interface CreateCluster {
    create_cluster: {
      /** used to create all necessary contract or register asset */
      params: Params;
    };
  }

  export interface PassCommand<T = string> {
    pass_command: {
      contract_addr: HumanAddr;
      msg: T; // Base64 or other msgs,
    };
  }

  export interface DecommissionCluster {
    decommission_cluster: {
      cluster_contract: HumanAddr;
      cluster_token: CW20Addr;
    };
  }

  export interface Distribute {
    distribute: {};
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
    staking_contract: HumanAddr;
    commission_collector: HumanAddr;
    protocol_fee_rate: string;
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
    contract_infos: Array<[HumanAddr, boolean]>;
  }

  export interface DistributionInfo {
    distribution_info: {};
  }

  export interface DistributionInfoResponse {
    weights: Array<[CW20Addr, rs.u32]>;
    last_distributed: rs.u64;
  }
}
