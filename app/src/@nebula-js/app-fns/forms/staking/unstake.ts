import { microfy } from '@libs/formatter';
import { LP, Rate, Token, u, Luna } from '@nebula-js/types';
import { min } from '@libs/big-math';
import { FormFunction, FormReturn } from '@libs/use-form';
import big, { Big, BigSource } from 'big.js';
import { TerraswapPoolInfo } from '@libs/app-fns';

export interface StakingUnstakeFormInput {
  lpAmount: LP;
}

export interface StakingUnstakeFormDependency<T extends Token> {
  poolInfo: TerraswapPoolInfo<T> | undefined;
  //
  lunaBalance: u<Luna>;
  lpBalance: u<LP>;
  taxRate: Rate;
  maxTaxUUSD: u<Luna>;
  fixedFee: u<Luna<BigSource>>;
  connected: boolean;
}

export interface StakingUnstakeFormStates<T extends Token>
  extends StakingUnstakeFormInput {
  maxLpAmount: u<LP>;
  invalidTxFee: string | null;
  invalidLpAmount: string | null;
  availableTx: boolean;
  //
  returnedUstAmount: u<Luna> | null;
  returnedTokenAmount: u<T> | null;
  //
  poolPrice: Luna | null;
  txFee: u<Luna<BigSource>> | null;
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
  lunaBalance,
  taxRate,
  maxTaxUUSD,
  fixedFee,
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
      Luna<Big>
    >;
    const token = big(poolInfo.tokenPoolSize)
      .mul(lp)
      .div(poolInfo.lpShare) as u<Token<Big>>;

    const poolPrice = poolInfo.tokenPrice;

    const txFee = min(ust.mul(taxRate), maxTaxUUSD).plus(fixedFee) as u<
      Luna<Big>
    >;

    const invalidTxFee =
      connected && txFee.gt(lunaBalance) ? 'Not enough transaction fees' : null;

    const invalidLpAmount =
      connected && lp.gt(lpBalance) ? 'Not enough assets' : null;

    const availableTx = connected && !invalidTxFee && !invalidLpAmount;

    return [
      {
        lpAmount,
        maxLpAmount,
        poolPrice,
        txFee,
        returnedUstAmount: ust.toFixed() as u<Luna>,
        returnedTokenAmount: token.toFixed() as u<T>,
        invalidTxFee,
        invalidLpAmount,
        availableTx,
      },
      undefined,
    ];
  };
};
