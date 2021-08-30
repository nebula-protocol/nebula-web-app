import { microfy } from '@libs/formatter';
import { LP, Token, u, UST } from '@nebula-js/types';
import { NebulaTax } from '@nebula-js/webapp-fns/types';
import { min } from '@libs/big-math';
import { FormFunction, FormReturn } from '@libs/use-form';
import big, { Big, BigSource } from 'big.js';
import { TerraswapPoolInfo } from '@libs/webapp-fns';

export interface StakingUnstakeFormInput {
  lpAmount: LP;
}

export interface StakingUnstakeFormDependency<T extends Token> {
  poolInfo: TerraswapPoolInfo<T> | undefined;
  //
  ustBalance: u<UST>;
  lpBalance: u<LP>;
  tax: NebulaTax;
  fixedGas: u<UST<BigSource>>;
  connected: boolean;
}

export interface StakingUnstakeFormStates<T extends Token>
  extends StakingUnstakeFormInput {
  maxLpAmount: u<LP>;
  invalidTxFee: string | null;
  invalidLpAmount: string | null;
  availableTx: boolean;
  //
  returnedUstAmount: u<UST> | null;
  returnedTokenAmount: u<T> | null;
  //
  poolPrice: UST | null;
  txFee: u<UST<BigSource>> | null;
}

export type StakingUnstakeFormAsyncStates = {};

export type StakingUnstakeForm<T extends Token> = FormFunction<
  StakingUnstakeFormInput,
  StakingUnstakeFormDependency<T>,
  StakingUnstakeFormStates<T>,
  StakingUnstakeFormAsyncStates
>;

export const stakingUnstakeForm = <T extends Token>({
  lpBalance,
  ustBalance,
  tax,
  fixedGas,
  poolInfo,
  connected,
}: StakingUnstakeFormDependency<T>) => {
  const maxLpAmount = lpBalance;

  return ({
    lpAmount,
  }: StakingUnstakeFormInput): FormReturn<
    StakingUnstakeFormStates<T>,
    StakingUnstakeFormAsyncStates
  > => {
    const lpAmountExists: boolean =
      !!lpAmount && lpAmount.length > 0 && big(lpAmount).gt(0);

    if (!lpAmountExists || !poolInfo) {
      return [
        {
          lpAmount,
          maxLpAmount,
          returnedUstAmount: null,
          returnedTokenAmount: null,
          poolPrice: null,
          txFee: null,
          invalidTxFee: null,
          invalidLpAmount: null,
          availableTx: false,
        },
        undefined,
      ];
    }

    const lp = microfy(lpAmount);
    const ust = big(poolInfo.ustPoolSize).mul(lp).div(poolInfo.lpShare) as u<
      UST<Big>
    >;
    const token = big(poolInfo.tokenPoolSize)
      .mul(lp)
      .div(poolInfo.lpShare) as u<Token<Big>>;

    const poolPrice = poolInfo.tokenPrice;

    const txFee = min(ust.mul(tax.taxRate), tax.maxTaxUUSD).plus(fixedGas) as u<
      UST<Big>
    >;

    const invalidTxFee =
      connected && txFee.gt(ustBalance) ? 'Not enough transaction fees' : null;

    const invalidLpAmount =
      connected && lp.gt(lpBalance) ? 'Not enough assets' : null;

    const availableTx = connected && !invalidTxFee && !invalidLpAmount;

    return [
      {
        lpAmount,
        maxLpAmount,
        poolPrice,
        txFee,
        returnedUstAmount: ust.toFixed() as u<UST>,
        returnedTokenAmount: token.toFixed() as u<T>,
        invalidTxFee,
        invalidLpAmount,
        availableTx,
      },
      undefined,
    ];
  };
};
