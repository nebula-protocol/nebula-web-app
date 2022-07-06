import { min } from '@libs/big-math';
import { demicrofy, microfy } from '@libs/formatter';
import { QueryClient } from '@libs/query-client';
import { CW20Addr, HumanAddr, Rate, Token, u, Luna } from '@libs/types';
import { FormFunction, FormReturn } from '@libs/use-form';
import big, { Big, BigSource } from 'big.js';
import { terraswapSimulationQuery } from '../../queries/terraswap/simulation';

export interface CW20SellTokenFormInput<T extends Token> {
  lunaAmount?: Luna;
  tokenAmount?: T;
  maxSpread: Rate;
}

export interface CW20SellTokenFormDependency<T extends Token> {
  queryClient: QueryClient;
  //
  lunaTokenPairAddr: HumanAddr;
  tokenAddr: CW20Addr;
  //
  lunaBalance: u<Luna>;
  tokenBalance: u<T>;
  taxRate: Rate;
  maxTaxUUSD: u<Luna>;
  fixedFee: u<Luna<BigSource>>;
  //
  connected: boolean;
}

export interface CW20SellTokenFormStates<T extends Token>
  extends CW20SellTokenFormInput<T> {
  tokenBalance: u<T>;
  invalidMaxSpread: string | null;
  invalidTxFee: string | null;
  invalidTokenAmount: string | null;
  availableTx: boolean;
}

export type CW20SellTokenFormAsyncStates<T extends Token> = (
  | { lunaAmount: Luna }
  | { tokenAmount: T }
) & {
  beliefPrice: T;
  txFee: u<Luna>;
  minimumReceived: u<Luna>;
  tradingFee: u<Luna>;
};

export type CW20SellTokenForm<T extends Token> = FormFunction<
  CW20SellTokenFormInput<T>,
  CW20SellTokenFormDependency<T>,
  CW20SellTokenFormStates<T>,
  CW20SellTokenFormAsyncStates<T>
>;

export const cw20SellTokenForm = <T extends Token>({
  lunaTokenPairAddr,
  tokenAddr,
  queryClient,
  //mantleEndpoint,
  //mantleFetch,
  //requestInit,
  lunaBalance,
  tokenBalance,
  taxRate,
  maxTaxUUSD,
  fixedFee,
  connected,
}: CW20SellTokenFormDependency<T>) => {
  return ({
    lunaAmount,
    tokenAmount,
    maxSpread,
  }: CW20SellTokenFormInput<T>): FormReturn<
    CW20SellTokenFormStates<T>,
    CW20SellTokenFormAsyncStates<T>
  > => {
    const lunaAmountExists: boolean =
      !!lunaAmount && lunaAmount.length > 0 && big(lunaAmount).gt(0);
    const ctAmountExists: boolean =
      !!tokenAmount && tokenAmount.length > 0 && big(tokenAmount).gt(0);

    const invalidMaxSpread: string | null =
      maxSpread.length === 0 ? 'Max Spread is required' : null;

    if (!lunaAmountExists && !ctAmountExists) {
      return [
        {
          lunaAmount,
          tokenAmount: tokenAmount,
          maxSpread,
          tokenBalance,
          invalidMaxSpread,
          invalidTxFee: null,
          invalidTokenAmount: null,
          availableTx: false,
        },
        undefined,
      ];
    }

    if (ctAmountExists) {
      return [
        {
          tokenAmount: tokenAmount,
          tokenBalance,
          maxSpread,
          invalidMaxSpread,
          invalidTxFee: null,
          invalidTokenAmount: null,
          availableTx: false,
        },
        terraswapSimulationQuery(
          lunaTokenPairAddr,
          {
            amount: microfy(tokenAmount!).toFixed() as u<Token>,
            info: {
              token: {
                contract_addr: tokenAddr,
              },
            },
          },
          queryClient,
        ).then(
          ({
            simulation: { return_amount, spread_amount, commission_amount },
          }) => {
            const _tax = min(
              big(return_amount).minus(
                big(return_amount).div(big(1).plus(taxRate)),
              ),
              maxTaxUUSD,
            ) as u<Luna<Big>>;

            const beliefPrice = microfy(tokenAmount!)
              .div(return_amount)
              .toFixed() as T;

            const rate = big(1).minus(maxSpread).toFixed() as Rate;

            const expectedAmount = big(return_amount).minus(_tax) as u<
              Luna<Big>
            >;

            const txFee = _tax.plus(fixedFee).toFixed() as u<Luna>;

            const tradingFee = big(commission_amount)
              .plus(spread_amount)
              .toFixed() as u<Luna>;

            const minimumReceived = expectedAmount
              .mul(rate)
              .toFixed() as u<Luna>;

            const invalidTxFee =
              connected && big(fixedFee).gt(lunaBalance)
                ? 'Not enough transaction fees'
                : null;

            const invalidTokenAmount =
              connected && microfy(tokenAmount!).gt(tokenBalance)
                ? 'Not enough assets'
                : null;

            const availableTx =
              connected &&
              !invalidTxFee &&
              !invalidTokenAmount &&
              !invalidMaxSpread &&
              !big(tradingFee).lte(0);

            return {
              lunaAmount: demicrofy(return_amount).toFixed() as Luna,
              beliefPrice,
              txFee,
              minimumReceived,
              tradingFee,
              invalidTxFee,
              invalidTokenAmount,
              availableTx,
            };
          },
        ),
      ];
    } else if (lunaAmountExists) {
      return [
        {
          lunaAmount,
          tokenBalance,
          maxSpread,
          invalidMaxSpread,
          invalidTxFee: null,
          invalidTokenAmount: null,
          availableTx: false,
        },
        terraswapSimulationQuery(
          lunaTokenPairAddr,
          {
            amount: microfy(lunaAmount!).toFixed() as u<Luna>,
            info: {
              native_token: {
                denom: 'uluna',
              },
            },
          },
          queryClient,
        ).then(
          ({
            simulation: { return_amount, spread_amount, commission_amount },
          }) => {
            const _tax = min(
              microfy(lunaAmount!).minus(
                microfy(lunaAmount!).div(big(1).plus(taxRate)),
              ),
              maxTaxUUSD,
            ) as u<Luna<Big>>;

            const beliefPrice = (
              big(return_amount).gt(0)
                ? big(1).div(microfy(lunaAmount!).div(return_amount).toFixed())
                : '0'
            ) as T;

            const expectedAmount = big(return_amount)
              .minus(_tax)
              .toFixed() as u<T>;

            const rate = big(1).minus(maxSpread) as Rate<Big>;

            const txFee = _tax.plus(fixedFee).toFixed() as u<Luna>;

            const tradingFee = big(commission_amount)
              .plus(spread_amount)
              .toFixed() as u<Luna>;

            const minimumReceived = big(expectedAmount)
              .mul(rate)
              .toFixed() as u<Luna>;

            const invalidTxFee =
              connected && big(fixedFee).gt(lunaBalance)
                ? 'Not enough transaction fees'
                : null;

            const invalidTokenAmount =
              connected && big(return_amount).gt(tokenBalance)
                ? 'Not enough assets'
                : null;

            const availableTx =
              connected &&
              !invalidTxFee &&
              !invalidTokenAmount &&
              !invalidMaxSpread &&
              !big(tradingFee).lte(0);

            return {
              tokenAmount: demicrofy(return_amount).toFixed() as T,
              beliefPrice,
              txFee,
              minimumReceived,
              tradingFee,
              invalidTokenAmount,
              invalidTxFee,
              availableTx,
            };
          },
        ),
      ];
    }

    return [
      {
        lunaAmount,
        tokenAmount: tokenAmount,
        maxSpread,
        tokenBalance,
        invalidMaxSpread,
        invalidTxFee: null,
        invalidTokenAmount: null,
        availableTx: false,
      },
      undefined,
    ];
  };
};
