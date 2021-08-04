import { HumanAddr } from './common';

export namespace lp {
  export interface Minter {
    minter: {};
  }

  export interface MinterResponse {
    /** terraswap pair address */
    minter: HumanAddr;
  }
}
