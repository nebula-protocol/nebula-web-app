import { formatUInput, microfy } from '@nebula-js/notation';
import { LP, Rate, Token, u, UST } from '@nebula-js/types';
import { NebulaTax } from '@nebula-js/webapp-fns/types';
import { min } from '@terra-dev/big-math';
import { FormFunction, FormReturn } from '@terra-dev/use-form';
import big, { Big, BigSource } from 'big.js';
import { computeMaxUstBalanceForUstTransfer } from '../../logics/computeMaxUstBalanceForUstTransfer';
import { TerraswapPoolInfo } from '../../queries/terraswap/pool';

export interface CW20ProvideTokenFormInput<T extends Token> {
  ustAmount?: UST;
  tokenAmount?: T;
}

export interface CW20ProvideTokenFormDependency<T extends Token> {
  poolInfo: TerraswapPoolInfo<T> | undefined;
  //
  ustBalance: u<UST>;
  tokenBalance: u<T>;
  tax: NebulaTax;
  fixedGas: u<UST<BigSource>>;
  connected: boolean;
}

export interface CW20ProvideTokenFormStates<T extends Token>
  extends CW20ProvideTokenFormInput<T> {
  maxUstAmount: u<UST<BigSource>>;
  maxTokenAmount: u<T>;
  invalidTxFee: string | null;
  invalidUstAmount: string | null;
  invalidTokenAmount: string | null;
  warningNextTxFee: string | null;
  availableTx: boolean;
  //
  poolPrice: UST | null;
  txFee: u<UST<BigSource>> | null;
  lpFromTx: u<LP<BigSource>> | null;
  shareOfPool: Rate<BigSource> | null;
}

export type CW20ProvideTokenFormAsyncStates = {};

export type CW20ProvideTokenForm<T extends Token> = FormFunction<
  CW20ProvideTokenFormInput<T>,
  CW20ProvideTokenFormDependency<T>,
  CW20ProvideTokenFormStates<T>,
  CW20ProvideTokenFormAsyncStates
>;

export const cw20ProvideTokenForm = <T extends Token>({
  ustBalance,
  tokenBalance,
  tax,
  fixedGas,
  poolInfo,
  connected,
}: CW20ProvideTokenFormDependency<T>) => {
  const maxUstAmount = computeMaxUstBalanceForUstTransfer(
    ustBalance,
    tax,
    fixedGas,
  );

  const maxTokenAmount = tokenBalance;

  return ({
    tokenAmount,
    ustAmount,
  }: CW20ProvideTokenFormInput<T>): FormReturn<
    CW20ProvideTokenFormStates<T>,
    CW20ProvideTokenFormAsyncStates
  > => {
    const ustAmountExists: boolean =
      !!ustAmount && ustAmount.length > 0 && big(ustAmount).gt(0);
    const tokenAmountExists: boolean =
      !!tokenAmount && tokenAmount.length > 0 && big(tokenAmount).gt(0);

    if ((!ustAmountExists && !tokenAmountExists) || !poolInfo) {
      return [
        {
          ustAmount,
          tokenAmount,
          maxUstAmount,
          maxTokenAmount,
          poolPrice: null,
          txFee: null,
          lpFromTx: null,
          shareOfPool: null,
          invalidTxFee: null,
          invalidUstAmount: null,
          invalidTokenAmount: null,
          warningNextTxFee: null,
          availableTx: false,
        },
        undefined,
      ];
    }

    let ust: u<UST<Big>>;
    let token: u<Token<Big>>;
    let returnUstAmount: UST | null = null;
    let returnTokenAmount: T | null = null;

    if (ustAmountExists) {
      ust = microfy(ustAmount!);
      token = big(ust).div(poolInfo.tokenPrice) as u<Token<Big>>;
      returnTokenAmount = formatUInput(token) as T;
    } else {
      token = microfy(tokenAmount!);
      ust = token.mul(poolInfo.tokenPrice) as u<UST<Big>>;
      returnUstAmount = formatUInput(ust) as UST;
    }

    const lpFromTx = min(
      ust.mul(poolInfo.lpShare).div(poolInfo.ustPoolSize),
      token.mul(poolInfo.lpShare).div(poolInfo.tokenPoolSize),
    ) as u<LP<Big>>;

    const shareOfPool = lpFromTx.div(
      big(poolInfo.lpShare).plus(lpFromTx),
    ) as Rate<Big>;

    const txFee = min(ust.mul(tax.taxRate), tax.maxTaxUUSD).plus(fixedGas) as u<
      UST<Big>
    >;

    const invalidTxFee =
      connected && txFee.gt(ustBalance) ? 'Not enough transaction fees' : null;

    const invalidUstAmount =
      connected && ust.gt(ustBalance) ? 'Not enough assets' : null;

    const invalidTokenAmount =
      connected && token.gt(tokenBalance) ? 'Not enough assets' : null;

    const availableTx =
      connected && !invalidTxFee && !invalidUstAmount && !invalidTokenAmount;

    const warningNextTxFee =
      connected &&
      availableTx &&
      big(ustBalance).minus(ust).minus(txFee).lt(fixedGas)
        ? 'You may run out of USD balance needed for future transactions'
        : null;

    return [
      {
        ustAmount: returnUstAmount ?? ustAmount,
        tokenAmount: returnTokenAmount ?? tokenAmount,
        maxUstAmount,
        maxTokenAmount,
        txFee,
        poolPrice: poolInfo.tokenPrice,
        lpFromTx,
        shareOfPool,
        invalidTxFee,
        invalidUstAmount,
        invalidTokenAmount,
        warningNextTxFee,
        availableTx,
      },
      undefined,
    ];
  };
};
