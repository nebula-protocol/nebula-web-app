import { demicrofy, microfy } from '@nebula-js/notation';
import {
  CW20Addr,
  HumanAddr,
  NativeDenom,
  Token,
  u,
  UST,
} from '@nebula-js/types';
import { min } from '@terra-dev/big-math';
import { MantleFetch } from '@terra-dev/mantle';
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
}

export interface CW20BuyTokenFormStates<T extends Token>
  extends CW20BuyTokenFormInput<T> {
  maxUstAmount: u<UST<Big>>;
}

export interface CW20BuyTokenFormAsyncStates<T extends Token> {
  ustAmount?: UST;
  tokenAmount?: T;
  beliefPrice: UST;
  txFee: u<UST<Big>>;
}

export const cw20BuyTokenForm = <T extends Token>({
  ustCtPairAddr,
  ctAddr,
  mantleEndpoint,
  mantleFetch,
  requestInit,
  ustBalance,
  tax,
  fixedGas,
}: CW20BuyTokenFormDependency) => {
  const maxUstAmount = computeMaxUstBalanceForUstTransfer(
    ustBalance,
    tax,
    fixedGas,
  );

  return ({
    ustAmount,
    tokenAmount,
  }: CW20BuyTokenFormInput<T>): [
    CW20BuyTokenFormStates<T>,
    Promise<CW20BuyTokenFormAsyncStates<T>> | undefined,
  ] => {
    const ustAmountExists: boolean =
      !!ustAmount && ustAmount.length > 0 && big(ustAmount).gt(0);
    const ctAmountExists: boolean =
      !!tokenAmount && tokenAmount.length > 0 && big(tokenAmount).gt(0);

    if (!ustAmountExists && !ctAmountExists) {
      return [{ ustAmount, tokenAmount: tokenAmount, maxUstAmount }, undefined];
    }

    if (ustAmountExists) {
      return [
        { ustAmount, maxUstAmount },
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
        }).then(({ simulation: { return_amount } }) => {
          const _tax = min(
            big(ustAmount!).mul(tax.taxRate),
            tax.maxTaxUUSD,
          ) as u<UST<Big>>;

          return {
            tokenAmount: demicrofy(return_amount).toFixed() as T,
            beliefPrice: (big(return_amount).gt(0)
              ? big(ustAmount!).div(return_amount).toFixed()
              : '0') as UST,
            txFee: _tax.plus(fixedGas) as u<UST<Big>>,
          };
        }),
      ];
    } else if (ctAmountExists) {
      return [
        { tokenAmount: tokenAmount, maxUstAmount },
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
        }).then(({ simulation: { return_amount } }) => {
          const _tax = min(
            big(return_amount).mul(tax.taxRate),
            tax.maxTaxUUSD,
          ) as u<UST<Big>>;

          return {
            ustAmount: demicrofy(return_amount).toFixed() as UST,
            beliefPrice: big(return_amount).div(tokenAmount!).toFixed() as UST,
            txFee: _tax.plus(fixedGas) as u<UST<Big>>,
          };
        }),
      ];
    }

    return [{ ustAmount, tokenAmount: tokenAmount, maxUstAmount }, undefined];
  };
};
