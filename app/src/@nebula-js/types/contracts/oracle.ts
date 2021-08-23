import { rs } from '@libs/types';

export namespace oracle {
  // ---------------------------------------------
  // QueryMsg
  // ---------------------------------------------
  export interface Price {
    price: {
      base_asset: string;
      quote_asset: string;
    };
  }

  export interface PriceResponse {
    rate: rs.Decimal;
    last_updated_base: rs.u64;
    last_updated_quote: rs.u64;
  }
}
