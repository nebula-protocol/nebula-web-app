import { HumanAddr } from '@libs/types';
import { Token, u } from '../tokens';

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

  export interface Send<T extends Token> {
    amount: u<T>;
    contract: HumanAddr;
    msg: string;
  }

  // ---------------------------------------------
  // QueryMsg
  // ---------------------------------------------
  export interface Balance {
    balance: {
      address: HumanAddr;
    };
  }

  export interface BalanceResponse<T extends Token> {
    balance: u<T>;
  }

  export interface TokenInfo {
    token_info: {};
  }

  export interface TokenInfoResponse<T extends Token> {
    decimals: number;
    name: string;
    symbol: string;
    total_supply: u<T>;
  }
}
