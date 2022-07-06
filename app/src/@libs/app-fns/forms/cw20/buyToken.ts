import { min } from '@libs/big-math';
import { demicrofy, microfy } from '@libs/formatter';
import { QueryClient } from '@libs/query-client';
import { CW20Addr, HumanAddr, Rate, Token, u, Luna } from '@libs/types';
import { FormFunction, FormReturn } from '@libs/use-form';
import big, { Big, BigSource } from 'big.js';
import { computeMaxLunaBalanceForTransfer } from '../../logics/computeMaxLunaBalanceForTransfer';
import { terraswapSimulationQuery } from '../../queries/terraswap/simulation';

export interface CW20BuyTokenFormInput<T extends Token> {
  lunaAmount?: Luna;
  tokenAmount?: T;
  maxSpread: Rate;
}

export interface CW20BuyTokenFormDependency {
  queryClient: QueryClient;
  //
  lunaTokenPairAddr: HumanAddr;
  tokenAddr: CW20Addr;
  //
  lunaBalance: u<Luna>;
  taxRate: Rate;
  maxTaxUUSD: u<Luna>;
  fixedFee: u<Luna<BigSource>>;
  //
  connected: boolean;
}

export interface CW20BuyTokenFormStates<T extends Token>
  extends CW20BuyTokenFormInput<T> {
  maxUstAmount: u<Luna<BigSource>>;
  invalidMaxSpread: string | null;
  invalidTxFee: string | null;
  invalidUstAmount: string | null;
  warningNextTxFee: string | null;
  availableTx: boolean;
}

export type CW20BuyTokenFormAsyncStates<T extends Token> = (
  | { lunaAmount: Luna }
  | { tokenAmount: T }
) & {
  beliefPrice: Luna;
  txFee: u<Luna>;
  minimumReceived: u<T>;
  tradingFee: u<T>;
};

export type CW20BuyTokenForm<T extends Token> = FormFunction<
  CW20BuyTokenFormInput<T>,
  CW20BuyTokenFormDependency,
  CW20BuyTokenFormStates<T>,
  CW20BuyTokenFormAsyncStates<T>
>;

export const cw20BuyTokenForm = <T extends Token>({
  lunaTokenPairAddr,
  tokenAddr,
  queryClient,
  //mantleEndpoint,
  //mantleFetch,
  //requestInit,
  lunaBalance,
  taxRate,
  maxTaxUUSD,
  fixedFee,
  connected,
}: CW20BuyTokenFormDependency) => {
  const maxUstAmount = computeMaxLunaBalanceForTransfer(
    lunaBalance,
    taxRate,
    maxTaxUUSD,
    fixedFee,
  );

  return ({
    lunaAmount,
    tokenAmount,
    maxSpread,
  }: CW20BuyTokenFormInput<T>): FormReturn<
    CW20BuyTokenFormStates<T>,
    CW20BuyTokenFormAsyncStates<T>
  > => {
    const lunaAmountExists: boolean =
      !!lunaAmount && lunaAmount.length > 0 && big(lunaAmount).gt(0);
    const tokenAmountExists: boolean =
      !!tokenAmount && tokenAmount.length > 0 && big(tokenAmount).gt(0);

    const invalidMaxSpread: string | null =
      maxSpread.length === 0 ? 'Max Spread is required' : null;

    if (!lunaAmountExists && !tokenAmountExists) {
      return [
        {
          lunaAmount,
          tokenAmount,
          maxSpread,
          maxUstAmount,
          invalidMaxSpread,
          invalidTxFee: null,
          invalidUstAmount: null,
          warningNextTxFee: null,
          availableTx: false,
        },
        undefined,
      ];
    }

    if (lunaAmountExists) {
      return [
        {
          lunaAmount,
          maxUstAmount,
          maxSpread,
          invalidMaxSpread,
          invalidTxFee: null,
          invalidUstAmount: null,
          warningNextTxFee: null,
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
            simulation: { return_amount, commission_amount, spread_amount },
          }) => {
            const _tax = min(
              microfy(lunaAmount!).mul(taxRate),
              maxTaxUUSD,
            ) as u<Luna<Big>>;

            const beliefPrice = (
              big(return_amount).gt(0)
                ? microfy(lunaAmount!).div(return_amount).toFixed()
                : '0'
            ) as Luna;

            const rate = big(1).minus(maxSpread).toFixed() as Rate;

            const expectedAmount = microfy(lunaAmount!)
              .div(beliefPrice)
              .minus(_tax) as u<Luna<Big>>;

            const txFee = _tax.plus(fixedFee).toFixed() as u<Luna>;

            const tradingFee = big(commission_amount)
              .plus(spread_amount)
              .toFixed() as u<T>;

            const invalidTxFee =
              connected && big(txFee).gt(lunaBalance)
                ? 'Not enough transaction fees'
                : null;

            const invalidUstAmount =
              connected && microfy(lunaAmount!).plus(txFee).gt(lunaBalance)
                ? 'Not enough Luna'
                : null;

            const availableTx =
              connected &&
              !invalidTxFee &&
              !invalidUstAmount &&
              !invalidMaxSpread &&
              !big(tradingFee).lte(0);

            const warningNextTxFee =
              connected &&
              availableTx &&
              big(lunaBalance)
                .minus(microfy(lunaAmount!))
                .minus(txFee)
                .lt(fixedFee)
                ? 'You may run out of USD balance needed for future transactions'
                : null;

            return {
              tokenAmount: demicrofy(return_amount).toFixed() as T,
              beliefPrice,
              txFee,
              minimumReceived: expectedAmount.mul(rate).toFixed() as u<T>,
              tradingFee,
              invalidTxFee,
              warningNextTxFee,
              invalidUstAmount,
              availableTx,
            };
          },
        ),
      ];
    } else if (tokenAmountExists) {
      return [
        {
          tokenAmount: tokenAmount,
          maxUstAmount,
          maxSpread,
          invalidMaxSpread,
          invalidTxFee: null,
          invalidUstAmount: null,
          warningNextTxFee: null,
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
            const _tax = min(big(return_amount).mul(taxRate), maxTaxUUSD) as u<
              Luna<Big>
            >;

            const beliefPrice = big(return_amount)
              .div(microfy(tokenAmount!))
              .toFixed() as Luna;

            const expectedAmount = big(return_amount)
              .div(beliefPrice)
              .minus(_tax) as u<Luna<Big>>;

            const rate = big(1).minus(maxSpread) as Rate<Big>;

            const txFee = _tax.plus(fixedFee).toFixed() as u<Luna>;

            const tradingFee = big(commission_amount)
              .plus(spread_amount)
              .toFixed() as u<T>;

            const invalidUstAmount =
              connected && big(return_amount).plus(txFee).gt(lunaBalance)
                ? 'Not enough Luna'
                : null;

            const invalidTxFee =
              connected && big(txFee).gt(lunaBalance)
                ? 'Not enough transaction fees'
                : null;

            const availableTx =
              connected &&
              !invalidTxFee &&
              !invalidUstAmount &&
              !invalidMaxSpread &&
              !big(tradingFee).lte(0);

            const warningNextTxFee =
              connected &&
              availableTx &&
              big(lunaBalance).minus(return_amount).minus(txFee).lt(fixedFee)
                ? 'You may run out of USD balance needed for future transactions'
                : null;

            return {
              lunaAmount: demicrofy(return_amount).toFixed() as Luna,
              beliefPrice,
              txFee,
              minimumReceived: expectedAmount.mul(rate).toFixed() as u<T>,
              tradingFee,
              invalidUstAmount,
              invalidTxFee,
              warningNextTxFee,
              availableTx,
            };
          },
        ),
      ];
    }

    return [
      {
        lunaAmount,
        tokenAmount,
        maxSpread,
        maxUstAmount,
        invalidMaxSpread,
        invalidTxFee: null,
        invalidUstAmount: null,
        warningNextTxFee: null,
        availableTx: false,
      },
      undefined,
    ];
  };
};
