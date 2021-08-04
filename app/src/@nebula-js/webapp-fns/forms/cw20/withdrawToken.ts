import { microfy } from '@nebula-js/notation';
import { LP, Rate, Token, u, UST } from '@nebula-js/types';
import { NebulaTax } from '@nebula-js/webapp-fns/types';
import { max, min } from '@terra-dev/big-math';
import { FormFunction, FormReturn } from '@terra-dev/use-form';
import big, { Big, BigSource } from 'big.js';
import { TerraswapPoolInfo } from '../../queries/terraswap/pool';

export interface CW20WithdrawTokenFormInput {
  lpAmount: LP;
}

export interface CW20WithdrawTokenFormDependency<T extends Token> {
  poolInfo: TerraswapPoolInfo<T> | undefined;
  //
  ustBalance: u<UST>;
  lpBalance: u<LP>;
  tax: NebulaTax;
  fixedGas: u<UST<BigSource>>;
  connected: boolean;
}

export interface CW20WithdrawTokenFormStates<T extends Token>
  extends CW20WithdrawTokenFormInput {
  maxLpAmount: u<LP>;
  invalidTxFee: string | null;
  invalidLpAmount: string | null;
  availableTx: boolean;
  //
  returnUstAmount: u<UST> | null;
  returnTokenAmount: u<T> | null;
  //
  poolPrice: UST | null;
  txFee: u<UST<BigSource>> | null;
  lpAfterTx: u<LP<BigSource>> | null;
  shareOfPool: Rate<BigSource> | null;
}

export type CW20WithdrawTokenFormAsyncStates = {};

export type CW20WithdrawTokenForm<T extends Token> = FormFunction<
  CW20WithdrawTokenFormInput,
  CW20WithdrawTokenFormDependency<T>,
  CW20WithdrawTokenFormStates<T>,
  CW20WithdrawTokenFormAsyncStates
>;

export const cw20WithdrawTokenForm = <T extends Token>({
  lpBalance,
  ustBalance,
  tax,
  fixedGas,
  poolInfo,
  connected,
}: CW20WithdrawTokenFormDependency<T>) => {
  const maxLpAmount = lpBalance;

  return ({
    lpAmount,
  }: CW20WithdrawTokenFormInput): FormReturn<
    CW20WithdrawTokenFormStates<T>,
    CW20WithdrawTokenFormAsyncStates
  > => {
    const lpAmountExists: boolean =
      !!lpAmount && lpAmount.length > 0 && big(lpAmount).gt(0);

    if (!lpAmountExists || !poolInfo) {
      return [
        {
          lpAmount,
          maxLpAmount,
          returnUstAmount: null,
          returnTokenAmount: null,
          poolPrice: null,
          txFee: null,
          lpAfterTx: null,
          shareOfPool: null,
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

    const lpAfterTx = max(0, big(lpBalance).minus(lp)) as u<LP<Big>>;

    const shareOfPool = lpAfterTx.div(
      big(poolInfo.lpShare).plus(lpAfterTx),
    ) as Rate<Big>;

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
        returnUstAmount: ust.toFixed() as u<UST>,
        returnTokenAmount: token.toFixed() as u<T>,
        lpAfterTx,
        shareOfPool,
        invalidTxFee,
        invalidLpAmount,
        availableTx,
      },
      undefined,
    ];
  };
};
