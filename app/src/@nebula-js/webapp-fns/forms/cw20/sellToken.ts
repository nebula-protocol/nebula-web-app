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
import { terraswapSimulationQuery } from '../../quries/terraswap/simulation';
import { NebulaTax } from '../../types';

export interface CW20SellTokenFormInput<T extends Token> {
  ustAmount?: UST;
  tokenAmount?: T;
}

export interface CW20SellTokenFormDependency<T extends Token> {
  // terraswap simulation
  mantleEndpoint: string;
  mantleFetch: MantleFetch;
  requestInit?: Omit<RequestInit, 'method' | 'body'>;
  ustCtPairAddr: HumanAddr;
  ctAddr: CW20Addr;
  //
  tokenBalance: u<T>;
  tax: NebulaTax;
  fixedGas: u<UST<BigSource>>;
}

export interface CW20SellTokenFormStates<T extends Token>
  extends CW20SellTokenFormInput<T> {
  tokenBalance: u<T>;
}

export interface CW20SellTokenFormAsyncStates<T extends Token> {
  ustAmount?: UST;
  tokenAmount?: T;
  beliefPrice: T;
  txFee: u<UST<Big>>;
}

export function cw20SellTokenForm<T extends Token>(
  { ustAmount, tokenAmount }: CW20SellTokenFormInput<T>,
  {
    ustCtPairAddr,
    ctAddr,
    mantleEndpoint,
    mantleFetch,
    requestInit,
    tokenBalance,
    tax,
    fixedGas,
  }: CW20SellTokenFormDependency<T>,
): [
  CW20SellTokenFormStates<T>,
  Promise<CW20SellTokenFormAsyncStates<T>> | undefined,
] {
  const ustAmountExists: boolean =
    !!ustAmount && ustAmount.length > 0 && big(ustAmount).gt(0);
  const ctAmountExists: boolean =
    !!tokenAmount && tokenAmount.length > 0 && big(tokenAmount).gt(0);

  if (!ustAmountExists && !ctAmountExists) {
    return [{ ustAmount, tokenAmount: tokenAmount, tokenBalance }, undefined];
  }

  if (ustAmountExists) {
    return [
      { ustAmount, tokenBalance },
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
          big(ustAmount!).minus(big(ustAmount!).div(big(1).plus(tax.taxRate))),
          tax.maxTaxUUSD,
        ) as u<UST<Big>>;

        return {
          tokenAmount: demicrofy(return_amount).toFixed() as T,
          beliefPrice: (big(return_amount).gt(0)
            ? big(1).div(big(ustAmount!).div(return_amount).toFixed())
            : '0') as T,
          txFee: _tax.plus(fixedGas) as u<UST<Big>>,
        };
      }),
    ];
  } else if (ctAmountExists) {
    return [
      { tokenAmount: tokenAmount, tokenBalance },
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
          big(return_amount).minus(
            big(return_amount).div(big(1).plus(tax.taxRate)),
          ),
          tax.maxTaxUUSD,
        ) as u<UST<Big>>;

        return {
          ustAmount: demicrofy(return_amount).toFixed() as UST,
          beliefPrice: big(tokenAmount!).div(return_amount).toFixed() as T,
          txFee: _tax.plus(fixedGas) as u<UST<Big>>,
        };
      }),
    ];
  }

  return [{ ustAmount, tokenAmount: tokenAmount, tokenBalance }, undefined];
}
