import { rs } from './common';

export namespace incentives_custody {
  // ---------------------------------------------
  // HandleMsg
  // ---------------------------------------------
  export interface RequestNeb {
    // TODO set token type
    amount: rs.Uint128;
  }
}
