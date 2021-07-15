import { Token, u } from '../tokens';
import { CW20Addr, HumanAddr, NativeDenom } from './common';

export namespace terraswap {
  export type CW20AssetInfo = { token: { contract_addr: CW20Addr } };
  export type NativeAssetInfo = { native_token: { denom: NativeDenom } };

  export type AssetInfo = CW20AssetInfo | NativeAssetInfo;

  export type CW20Asset<T extends u<Token>> = {
    amount: T;
    info: CW20AssetInfo;
  };
  export type NativeAsset<T extends u<Token>> = {
    amount: T;
    info: NativeAssetInfo;
  };

  export type Asset<T extends u<Token>> = CW20Asset<T> | NativeAsset<T>;

  export namespace factory {
    export interface Pair {
      pair: {
        asset_infos: [AssetInfo, AssetInfo];
      };
    }

    export interface PairResponse {
      asset_infos: [AssetInfo, AssetInfo];
      contract_addr: HumanAddr;
      liquidity_token: HumanAddr;
    }
  }

  export namespace pair {
    export interface Pool {
      pool: {};
    }

    export interface PoolResponse<A extends u<Token>, B extends u<Token>> {
      total_share: string;
      assets: [Asset<A | B>, Asset<A | B>];
    }

    export interface Simulation<T extends u<Token>> {
      simulation: {
        offer_asset: {
          info: AssetInfo;
          amount: T;
        };
      };
    }

    export interface SimulationResponse<
      T extends u<Token>,
      RT extends u<Token> = T,
    > {
      commission_amount: T;
      return_amount: RT;
      spread_amount: T;
    }

    export interface ReverseSimulation<T extends u<Token>> {
      reverse_simulation: {
        ask_asset: {
          info: AssetInfo;
          amount: T;
        };
      };
    }

    export interface ReverseSimulationResponse<
      T extends u<Token>,
      RT extends u<Token> = T,
    > {
      commission_amount: T;
      offer_amount: RT;
      spread_amount: T;
    }
  }
}
