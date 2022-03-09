import { UST, DateTime } from '@nebula-js/types';

export namespace anchor {
  export interface Base {
    base: {
      price: {
        asset_token: string;
      };
    };
  }

  export interface BaseResponse {
    rate: UST;
    last_update: DateTime;
  }
}
