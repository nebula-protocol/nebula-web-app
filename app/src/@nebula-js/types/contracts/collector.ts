import { HumanAddr } from '@libs/types';

export namespace collector {
  // ---------------------------------------------
  // HandleMsg
  // ---------------------------------------------
  export interface Convert {
    convert: {
      asset_token: HumanAddr;
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
    distribution_contract: HumanAddr; // collected rewards receiver
    terraswap_factory: HumanAddr;
    nebula_token: HumanAddr;
    base_denom: string;
    owner: HumanAddr;
  }
}
