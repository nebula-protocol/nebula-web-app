import { rs } from '@libs/types';

export namespace oracle_hub {
  // ---------------------------------------------
  // QueryMsg
  // ---------------------------------------------
  export interface Price {
    price_by_symbol: {
      symbol: string;
    };
  }

  export interface PriceResponse {
    rate: rs.Decimal;
    last_updated: rs.u64;
  }
}
