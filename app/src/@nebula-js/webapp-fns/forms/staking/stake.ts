import { min } from '@libs/big-math';
import { formatUInput, microfy } from '@libs/formatter';
import { FormReturn } from '@libs/use-form';
import {
  computeMaxUstBalanceForUstTransfer,
  TerraswapPoolInfo,
} from '@libs/webapp-fns';
import { CT, LP, Rate, Token, u, UST } from '@nebula-js/types';
import big, { Big, BigSource } from 'big.js';
import { NebulaTax } from '../../types';

export interface StakingStakeFormInput {
  ustAmount?: UST;
  tokenAmount?: CT;
  slippageTolerance: Rate;
}

export interface StakingStakeFormDependency {
  poolInfo: TerraswapPoolInfo<CT> | undefined;
  //
  ustBalance: u<UST>;
  tokenBalance: u<CT>;
  tax: NebulaTax;
  fixedGas: u<UST<BigSource>>;
  connected: boolean;
}

export interface StakingStakeFormStates extends StakingStakeFormInput {
  maxUstAmount: u<UST<BigSource>>;
  maxTokenAmount: u<CT>;
  invalidSlippageTolerance: string | null;
  invalidTxFee: string | null;
  invalidUstAmount: string | null;
  invalidTokenAmount: string | null;
  warningNextTxFee: string | null;
  availableTx: boolean;
  //
  poolPrice: UST | null;
  txFee: u<UST<BigSource>> | null;
  lpStakedFromTx: u<LP<BigSource>> | null;
}

export type StakingStakeFormAsyncStates = {};

export const stakingStakeForm = ({
  ustBalance,
  tokenBalance,
  tax,
  fixedGas,
  poolInfo,
  connected,
}: StakingStakeFormDependency) => {
  const maxUstAmount = computeMaxUstBalanceForUstTransfer(
    ustBalance,
    tax,
    fixedGas,
  );

  const maxTokenAmount = tokenBalance;

  return ({
    tokenAmount,
    ustAmount,
    slippageTolerance,
  }: StakingStakeFormInput): FormReturn<
    StakingStakeFormStates,
    StakingStakeFormAsyncStates
  > => {
    const ustAmountExists: boolean =
      !!ustAmount && ustAmount.length > 0 && big(ustAmount).gt(0);
    const tokenAmountExists: boolean =
      !!tokenAmount && tokenAmount.length > 0 && big(tokenAmount).gt(0);

    const invalidSlippageTolerance =
      slippageTolerance.length === 0 ? 'Slippage Tolerance is required' : null;

    if ((!ustAmountExists && !tokenAmountExists) || !poolInfo) {
      return [
        {
          ustAmount,
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

    let ust: u<UST<Big>>;
    let token: u<Token<Big>>;
    let returnedUstAmount: UST | null = null;
    let returnedTokenAmount: CT | null = null;

    if (ustAmountExists) {
      ust = microfy(ustAmount!);
      token = big(ust).div(poolInfo.tokenPrice) as u<Token<Big>>;
      returnedTokenAmount = formatUInput(token) as CT;
    } else {
      token = microfy(tokenAmount!);
      ust = token.mul(poolInfo.tokenPrice) as u<UST<Big>>;
      returnedUstAmount = formatUInput(ust) as UST;
    }

    const lpFromTx = min(
      ust.mul(poolInfo.lpShare).div(poolInfo.ustPoolSize),
      token.mul(poolInfo.lpShare).div(poolInfo.tokenPoolSize),
    ) as u<LP<Big>>;

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
        ustAmount: returnedUstAmount ?? ustAmount,
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
