import { Token, u } from '../tokens';
import { CW20Addr, Denom, HumanAddr, NativeDenom } from './common';

export namespace terraswap {
  export type CW20AssetInfo = { token: { contract_addr: CW20Addr } };

  export type AssetInfo =
    | CW20AssetInfo
    | { native_token: { denom: NativeDenom } };

  export type Asset<T extends u<Token>, NT extends u<Token>> =
    | {
        amount: T;
        info: {
          token: {
            contract_addr: HumanAddr;
          };
        };
      }
    | {
        amount: NT;
        info: {
          native_token: {
            denom: NativeDenom;
          };
        };
      };

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

    export interface PoolResponse<T extends u<Token>, NT extends u<Token>> {
      total_share: string;
      assets: [Asset<T, NT>, Asset<T, NT>];
    }

    export type SimulationInfo =
      | {
          token: {
            contract_addr: CW20Addr;
          };
        }
      | {
          native_token: {
            denom: Denom;
          };
        };

    export interface Simulation<T extends u<Token>> {
      simulation: {
        offer_asset: {
          info: SimulationInfo;
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

    export type ReverseSimulationInfo =
      | {
          token: {
            contract_addr: CW20Addr;
          };
        }
      | {
          native_token: {
            denom: Denom;
          };
        };

    export interface ReverseSimulation<T extends u<Token>> {
      reverse_simulation: {
        ask_asset: {
          info: ReverseSimulationInfo;
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
