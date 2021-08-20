import { NEB, u } from '../tokens';
import { HumanAddr, rs } from './common';

export namespace community {
  // ---------------------------------------------
  // HandleMsg
  // ---------------------------------------------
  export interface UpdateConfig {
    update_config: {
      owner?: HumanAddr;
      spend_limit?: rs.Uint128;
    };
  }

  export interface Spend {
    spend: {
      recipient: HumanAddr;
      amount: u<NEB<rs.Uint128>>;
    };
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
    // TODO is this token amount?
    spend_limit: rs.Uint128;
  }
}
