import { u, Token } from '../tokens';
import { HumanAddr } from './common';

export namespace cw20 {
  // ---------------------------------------------
  // HandleMsg
  // ---------------------------------------------
  export interface IncreaseAllowance {
    increase_allowance: {
      spender: HumanAddr;
      amount: u<Token>;
    };
  }

  // ---------------------------------------------
  // QueryMsg
  // ---------------------------------------------
  export interface Balance {
    balance: {
      address: HumanAddr;
    };
  }

  export interface BalanceResponse<T extends u<Token>> {
    balance: T;
  }

  export interface TokenInfo {
    token_info: {};
  }

  export interface TokenInfoResponse<T extends u<Token>> {
    decimals: number;
    name: string;
    symbol: string;
    total_supply: T;
  }
}
