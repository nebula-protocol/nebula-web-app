import { Token, u } from '../tokens';
import { CW20Addr, Denom, HumanAddr } from './common';

export namespace terraswap {
  export interface AssetInfo {
    // TODO
  }

  export interface Asset {
    // TODO
  }

  export interface Pool {
    pool: {};
  }

  export interface PoolResponse<T extends u<Token>> {
    total_share: string;
    assets: [
      {
        amount: T;
        info: {
          token: {
            contract_addr: HumanAddr;
          };
        };
      },
      {
        amount: T;
        info: {
          native_token: {
            denom: Denom;
          };
        };
      },
    ];
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
