import { rs } from '@libs/types';
import { terraswap } from '..';

export namespace oracle {
  // ---------------------------------------------
  // QueryMsg
  // ---------------------------------------------
  export interface Price {
    price: {
      base_asset: terraswap.AssetInfo;
      quote_asset: terraswap.AssetInfo;
    };
  }

  export interface PriceResponse {
    rate: rs.Decimal;
    last_updated_base: rs.u64;
    last_updated_quote: rs.u64;
  }
}
