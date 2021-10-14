import { HumanAddr, rs, u } from '@libs/types';
import { NEB } from '../tokens';

export namespace community {
  // ---------------------------------------------
  // HandleMsg
  // ---------------------------------------------
  export interface UpdateConfig {
    update_config: {
      owner?: HumanAddr;
      spend_limit?: u<NEB<rs.Uint128>>;
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
    spend_limit: u<NEB<rs.Uint128>>;
  }
}
