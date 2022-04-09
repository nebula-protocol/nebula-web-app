import { HumanAddr, terraswap, Token } from '@libs/types';

export namespace community {
  // ---------------------------------------------
  // HandleMsg
  // ---------------------------------------------
  export interface UpdateConfig {
    update_config: {
      owner?: HumanAddr;
    };
  }

  export interface Spend {
    spend: {
      recipient: HumanAddr;
      asset: terraswap.Asset<Token>;
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
  }
}
