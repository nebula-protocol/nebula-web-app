import { HumanAddr, rs } from './common';

export namespace community {
  // ---------------------------------------------
  // HandleMsg
  // ---------------------------------------------
  export interface UpdateConfig {
    owner?: HumanAddr;
    spend_limit?: rs.Uint128;
  }

  export interface Spend {
    recipient: HumanAddr;
    // TODO set token type to amount
    amount: rs.Uint128;
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
