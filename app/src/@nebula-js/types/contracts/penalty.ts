import { CT, Token, u } from '../tokens';
import { rs } from './common';

export namespace penalty {
  // ---------------------------------------------
  // QueryMsg
  // ---------------------------------------------
  // FIXME this type is HandleMsg and QueryMsg both
  export interface Mint {
    mint: {
      block_height: rs.u64;
      // TODO is this token type?
      cluster_token_supply: rs.Uint128;
      // TODO is this token type?
      inventory: rs.Uint128[];
      // TODO set token type to mint_asset_amounts
      mint_asset_amounts: u<Token<rs.Uint128>>[];
      // TODO ??? is this string?
      asset_prices: string[];
      // TODO is this type correct?
      target_weights: u<Token<rs.Uint128>>[];
    };
  }

  export interface MintResponse {
    mint_tokens: rs.Uint128;
    // TODO is this token type?
    penalty: rs.Uint128;
    log: unknown[]; //LogAttribute[],
  }

  // FIXME this type is HandleMsg and QueryMsg both
  export interface Redeem {
    redeem: {
      block_height: rs.u64;
      // TODO is this token type?
      cluster_token_supply: rs.Uint128;
      // TODO is this token type?
      inventory: rs.Uint128[];
      max_tokens: u<CT<rs.Uint128>>;
      // TODO set token type to redeem_asset_amounts
      redeem_asset_amounts: rs.Uint128[];
      // TODO ??? is this string?
      asset_prices: string[];
      // TODO is this type correct?
      target_weights: u<Token<rs.Uint128>>[];
    };
  }

  export interface RedeemResponse {
    redeem_assets: u<Token<rs.Uint128>>[];
    // TODO is this token type?
    penalty: rs.Uint128;
    // TODO is this token type?
    token_cost: u<CT<rs.Uint128>>;
    log: unknown[]; //LogAttribute[],
  }

  export interface Params {
    params: {};
  }

  export interface ParamsResponse {
    //penalty_params: PenaltyParams;
    last_block: rs.u64;
    ema: String;
  }

  //export interface PenaltyParams {
  //  // penalty_amt_lo -> amount of penalty when imbalance <= penalty_cutoff_lo * E
  //  penalty_amt_lo: FPDecimal;
  //  penalty_cutoff_lo: FPDecimal;
  //
  //  // penalty_amt_hi -> amount of penalty when imbalance >= penalty_cutoff_hi * E
  //  penalty_amt_hi: FPDecimal;
  //  penalty_cutoff_hi: FPDecimal;
  //  // in between penalty_cutoff_hi and penalty_cutoff_lo, the amount of penalty increases linearly
  //
  //  // reward_amt -> amount of reward when imbalance >= reward_cutoff * E
  //  // no reward everywhere else
  //  reward_amt: FPDecimal;
  //  reward_cutoff: FPDecimal;
  //}
}
