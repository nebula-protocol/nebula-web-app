import { HumanAddr } from './common';

export namespace collector {
  // ---------------------------------------------
  // HandleMsg
  // ---------------------------------------------
  export interface Convert {
    asset_token: HumanAddr;
  }

  export interface Distribute {}

  // ---------------------------------------------
  // QueryMsg
  // ---------------------------------------------
  export interface Config {}

  export interface ConfigResponse {
    distribution_contract: HumanAddr; // collected rewards receiver
    terraswap_factory: HumanAddr;
    nebula_token: HumanAddr;
    base_denom: string;
    owner: HumanAddr;
  }
}
