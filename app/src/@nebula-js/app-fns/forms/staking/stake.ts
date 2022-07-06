import {
  computeMaxLunaBalanceForTransfer,
  TerraswapPoolInfo,
} from '@libs/app-fns';
import { min } from '@libs/big-math';
import { formatUInput, microfy } from '@libs/formatter';
import { FormReturn } from '@libs/use-form';
import { CT, LP, Rate, Token, u, Luna } from '@nebula-js/types';
import big, { Big, BigSource } from 'big.js';

export interface StakingStakeFormInput {
  lunaAmount?: Luna;
  tokenAmount?: CT;
  slippageTolerance: Rate;
}

export interface StakingStakeFormDependency {
  poolInfo: TerraswapPoolInfo<CT> | undefined;
  //
  lunaBalance: u<Luna>;
  tokenBalance: u<CT>;
  taxRate: Rate;
  maxTaxUUSD: u<Luna>;
  fixedFee: u<Luna<BigSource>>;
  connected: boolean;
}

export interface StakingStakeFormStates extends StakingStakeFormInput {
  maxUstAmount: u<Luna<BigSource>>;
  maxTokenAmount: u<CT>;
  invalidSlippageTolerance: string | null;
  invalidTxFee: string | null;
  invalidUstAmount: string | null;
  invalidTokenAmount: string | null;
  warningNextTxFee: string | null;
  availableTx: boolean;
  //
  poolPrice: Luna | null;
  txFee: u<Luna<BigSource>> | null;
  lpStakedFromTx: u<LP<BigSource>> | null;
}

export type StakingStakeFormAsyncStates = {};

export const stakingStakeForm = ({
  lunaBalance,
  tokenBalance,
  taxRate,
  maxTaxUUSD,
  fixedFee,
  poolInfo,
  connected,
}: StakingStakeFormDependency) => {
  const maxUstAmount = computeMaxLunaBalanceForTransfer(
    lunaBalance,
    taxRate,
    maxTaxUUSD,
    fixedFee,
  );

  const maxTokenAmount = tokenBalance;

  return ({
    tokenAmount,
    lunaAmount,
    slippageTolerance,
  }: StakingStakeFormInput): FormReturn<
    StakingStakeFormStates,
    StakingStakeFormAsyncStates
  > => {
    const lunaAmountExists: boolean =
      !!lunaAmount && lunaAmount.length > 0 && big(lunaAmount).gt(0);
    const tokenAmountExists: boolean =
      !!tokenAmount && tokenAmount.length > 0 && big(tokenAmount).gt(0);

    const invalidSlippageTolerance =
      slippageTolerance.length === 0 ? 'Slippage Tolerance is required' : null;

    if ((!lunaAmountExists && !tokenAmountExists) || !poolInfo) {
      return [
        {
          lunaAmount,
          tokenAmount,
          slippageTolerance,
          maxUstAmount,
          maxTokenAmount,
          poolPrice: null,
          txFee: null,
          lpStakedFromTx: null,
          invalidSlippageTolerance,
          invalidTxFee: null,
          invalidUstAmount: null,
          invalidTokenAmount: null,
          warningNextTxFee: null,
          availableTx: false,
        },
        undefined,
      ];
    }

    let ust: u<Luna<Big>>;
    let token: u<Token<Big>>;
    let returnedUstAmount: Luna | null = null;
    let returnedTokenAmount: CT | null = null;

    if (lunaAmountExists) {
      ust = microfy(lunaAmount!);
      token = big(ust).div(poolInfo.tokenPrice) as u<Token<Big>>;
      returnedTokenAmount = formatUInput(token) as CT;
    } else {
      token = microfy(tokenAmount!);
      ust = token.mul(poolInfo.tokenPrice) as u<Luna<Big>>;
      returnedUstAmount = formatUInput(ust) as Luna;
    }

    const lpFromTx = min(
      ust.mul(poolInfo.lpShare).div(poolInfo.ustPoolSize),
      token.mul(poolInfo.lpShare).div(poolInfo.tokenPoolSize),
    ) as u<LP<Big>>;

    const txFee = min(ust.mul(taxRate), maxTaxUUSD).plus(fixedFee) as u<
      Luna<Big>
    >;

    const invalidTxFee =
      connected && txFee.gt(lunaBalance) ? 'Not enough transaction fees' : null;

    const invalidUstAmount =
      connected && ust.gt(lunaBalance) ? 'Not enough assets' : null;

    const invalidTokenAmount =
      connected && token.gt(tokenBalance) ? 'Not enough assets' : null;

    const availableTx =
      connected && !invalidTxFee && !invalidUstAmount && !invalidTokenAmount;

    const warningNextTxFee =
      connected &&
      availableTx &&
      big(lunaBalance).minus(ust).minus(txFee).lt(fixedFee)
        ? 'You may run out of USD balance needed for future transactions'
        : null;

    return [
      {
        lunaAmount: returnedUstAmount ?? lunaAmount,
        tokenAmount: returnedTokenAmount ?? tokenAmount,
        slippageTolerance,
        maxUstAmount,
        maxTokenAmount,
        txFee,
        poolPrice: poolInfo.tokenPrice,
        lpStakedFromTx: lpFromTx,
        invalidSlippageTolerance,
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
