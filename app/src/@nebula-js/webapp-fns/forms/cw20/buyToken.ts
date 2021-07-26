import { demicrofy, microfy } from '@nebula-js/notation';
import {
  CW20Addr,
  HumanAddr,
  NativeDenom,
  Rate,
  Token,
  u,
  UST,
} from '@nebula-js/types';
import { min } from '@terra-dev/big-math';
import { MantleFetch } from '@terra-dev/mantle';
import { FormFunction, FormReturn } from '@terra-dev/use-form';
import big, { Big, BigSource } from 'big.js';
import { computeMaxUstBalanceForUstTransfer } from '../../logics/computeMaxUstBalanceForUstTransfer';
import { terraswapSimulationQuery } from '../../queries/terraswap/simulation';
import { NebulaTax } from '../../types';

export interface CW20BuyTokenFormInput<T extends Token> {
  ustAmount?: UST;
  tokenAmount?: T;
}

export interface CW20BuyTokenFormDependency {
  // terraswap simulation
  mantleEndpoint: string;
  mantleFetch: MantleFetch;
  requestInit?: Omit<RequestInit, 'method' | 'body'>;
  ustCtPairAddr: HumanAddr;
  ctAddr: CW20Addr;
  //
  ustBalance: u<UST>;
  tax: NebulaTax;
  fixedGas: u<UST<BigSource>>;
  //
  maxSpread?: number;
  connected: boolean;
}

export interface CW20BuyTokenFormStates<T extends Token>
  extends CW20BuyTokenFormInput<T> {
  maxUstAmount: u<UST<BigSource>>;
  invalidTxFee: string | null;
  invalidUstAmount: string | null;
  warningNextTxFee: string | null;
  availableTx: boolean;
}

export type CW20BuyTokenFormAsyncStates<T extends Token> = (
  | {
      ustAmount: UST;
    }
  | { tokenAmount?: T }
) & {
  beliefPrice: UST;
  txFee: u<UST>;
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
  ustCtPairAddr,
  ctAddr,
  mantleEndpoint,
  mantleFetch,
  requestInit,
  ustBalance,
  tax,
  fixedGas,
  maxSpread = 0.1,
  connected,
}: CW20BuyTokenFormDependency) => {
  const maxUstAmount = computeMaxUstBalanceForUstTransfer(
    ustBalance,
    tax,
    fixedGas,
  );

  console.log('buyToken.ts..cw20BuyTokenForm()', maxUstAmount.toFixed());
  console.log('buyToken.ts..cw20BuyTokenForm()', ustBalance);

  return ({
    ustAmount,
    tokenAmount,
  }: CW20BuyTokenFormInput<T>): FormReturn<
    CW20BuyTokenFormStates<T>,
    CW20BuyTokenFormAsyncStates<T>
  > => {
    const ustAmountExists: boolean =
      !!ustAmount && ustAmount.length > 0 && big(ustAmount).gt(0);
    const ctAmountExists: boolean =
      !!tokenAmount && tokenAmount.length > 0 && big(tokenAmount).gt(0);

    if (!ustAmountExists && !ctAmountExists) {
      return [
        {
          ustAmount,
          tokenAmount: tokenAmount,
          maxUstAmount,
          invalidTxFee: null,
          invalidUstAmount: null,
          warningNextTxFee: null,
          availableTx: false,
        },
        undefined,
      ];
    }

    if (ustAmountExists) {
      return [
        {
          ustAmount,
          maxUstAmount,
          invalidTxFee: null,
          invalidUstAmount: null,
          warningNextTxFee: null,
          availableTx: false,
        },
        terraswapSimulationQuery({
          mantleEndpoint,
          mantleFetch,
          requestInit,
          wasmQuery: {
            simulation: {
              contractAddress: ustCtPairAddr,
              query: {
                simulation: {
                  offer_asset: {
                    amount: microfy(ustAmount!).toFixed() as u<UST>,
                    info: {
                      native_token: {
                        denom: 'uusd' as NativeDenom,
                      },
                    },
                  },
                },
              },
            },
          },
        }).then(
          ({
            simulation: { return_amount, commission_amount, spread_amount },
          }) => {
            const _tax = min(
              big(microfy(ustAmount!)).mul(tax.taxRate),
              tax.maxTaxUUSD,
            ) as u<UST<Big>>;

            const beliefPrice = (
              big(return_amount).gt(0)
                ? big(ustAmount!).div(return_amount).toFixed()
                : '0'
            ) as UST;

            const rate = big(1).minus(maxSpread).toFixed() as Rate;

            const expectedAmount = big(ustAmount!)
              .div(beliefPrice)
              .minus(_tax) as u<UST<Big>>;

            const txFee = _tax.plus(fixedGas).toFixed() as u<UST>;

            const tradingFee = big(commission_amount)
              .plus(spread_amount)
              .toFixed() as u<T>;

            const invalidTxFee =
              connected && big(txFee).gt(ustBalance)
                ? 'Not enough transaction fees'
                : null;

            const invalidUstAmount =
              connected && big(microfy(ustAmount!)).plus(txFee).gt(ustBalance)
                ? 'Not enough UST'
                : null;

            const availableTx =
              connected &&
              !invalidTxFee &&
              !invalidUstAmount &&
              !big(tradingFee).lte(0);

            const warningNextTxFee =
              connected &&
              availableTx &&
              big(ustBalance)
                .minus(microfy(ustAmount!))
                .minus(txFee)
                .lt(fixedGas)
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
    } else if (ctAmountExists) {
      return [
        {
          tokenAmount: tokenAmount,
          maxUstAmount,
          invalidTxFee: null,
          invalidUstAmount: null,
          warningNextTxFee: null,
          availableTx: false,
        },
        terraswapSimulationQuery({
          mantleEndpoint,
          mantleFetch,
          requestInit,
          wasmQuery: {
            simulation: {
              contractAddress: ustCtPairAddr,
              query: {
                simulation: {
                  offer_asset: {
                    amount: microfy(tokenAmount!).toFixed() as u<Token>,
                    info: {
                      token: {
                        contract_addr: ctAddr,
                      },
                    },
                  },
                },
              },
            },
          },
        }).then(
          ({
            simulation: { return_amount, spread_amount, commission_amount },
          }) => {
            const _tax = min(
              big(return_amount).mul(tax.taxRate),
              tax.maxTaxUUSD,
            ) as u<UST<Big>>;

            const beliefPrice = big(return_amount)
              .div(tokenAmount!)
              .toFixed() as UST;

            const expectedAmount = big(return_amount)
              .div(beliefPrice)
              .minus(_tax) as u<UST<Big>>;

            const rate = big(1).minus(maxSpread) as Rate<Big>;

            const txFee = _tax.plus(fixedGas).toFixed() as u<UST>;

            const tradingFee = big(commission_amount)
              .plus(spread_amount)
              .toFixed() as u<T>;

            const invalidUstAmount =
              connected && big(return_amount).plus(txFee).gt(ustBalance)
                ? 'Not enough UST'
                : null;

            const invalidTxFee =
              connected && big(txFee).gt(ustBalance)
                ? 'Not enough transaction fees'
                : null;

            const availableTx =
              connected &&
              !invalidTxFee &&
              !invalidUstAmount &&
              !big(tradingFee).lte(0);

            const warningNextTxFee =
              connected &&
              availableTx &&
              big(ustBalance).minus(return_amount).minus(txFee).lt(fixedGas)
                ? 'You may run out of USD balance needed for future transactions'
                : null;

            return {
              ustAmount: demicrofy(return_amount).toFixed() as UST,
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
        ustAmount,
        tokenAmount: tokenAmount,
        maxUstAmount,
        invalidTxFee: null,
        invalidUstAmount: null,
        warningNextTxFee: null,
        availableTx: false,
      },
      undefined,
    ];
  };
};
