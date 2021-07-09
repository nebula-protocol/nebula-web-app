import { rs } from './common';

export namespace incentives_custody {
  // ---------------------------------------------
  // QueryMsg
  // ---------------------------------------------
  export interface RequestNeb {
    amount: rs.Uint128;
  }
}
