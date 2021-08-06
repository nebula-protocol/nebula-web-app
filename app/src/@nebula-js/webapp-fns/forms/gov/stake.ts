import { microfy } from '@nebula-js/notation';
import { NEB, u, UST } from '@nebula-js/types';
import { FormReturn } from '@terra-dev/use-form';
import big, { Big, BigSource } from 'big.js';

export interface GovStakeFormInput {
  nebAmount: NEB;
  lockForWeeks: number;
}

export interface GovStakeFormDependency {
  minLockForWeeks?: number;
  maxLockForWeeks?: number;
  nebBalance: u<NEB>;
  ustBalance: u<UST<BigSource>>;
  fixedGas: u<UST<BigSource>>;
  connected: boolean;
}

export interface GovStakeFormStates extends GovStakeFormInput {
  minLockForWeeks: number;
  maxLockForWeeks: number;
  maxNebAmount: u<NEB>;
  invalidTxFee: string | null;
  invalidNebAmount: string | null;
  availableTx: boolean;
  //
  txFee: u<UST<BigSource>> | null;
}

export type GovStakeFormAsyncStates = {};

export const govStakeForm = ({
  nebBalance,
  ustBalance,
  minLockForWeeks = 1,
  maxLockForWeeks = 104,
  fixedGas,
  connected,
}: GovStakeFormDependency) => {
  const maxAmount = nebBalance;

  return ({
    nebAmount,
    lockForWeeks,
  }: GovStakeFormInput): FormReturn<
    GovStakeFormStates,
    GovStakeFormAsyncStates
  > => {
    const amountExists: boolean = nebAmount.length > 0 && big(nebAmount).gt(0);

    if (!amountExists) {
      return [
        {
          nebAmount,
          maxNebAmount: maxAmount,
          lockForWeeks,
          minLockForWeeks,
          maxLockForWeeks,
          txFee: null,
          invalidNebAmount: null,
          invalidTxFee: null,
          availableTx: false,
        },
        undefined,
      ];
    }

    const neb = microfy(nebAmount) as u<NEB<Big>>;

    const txFee = fixedGas;

    const invalidTxFee =
      connected && big(txFee).gt(ustBalance)
        ? 'Not enough transaction fees'
        : null;

    const invalidNebAmount =
      connected && big(neb).gt(nebBalance) ? 'Not enough assets' : null;

    const availableTx = connected && !invalidTxFee && !invalidNebAmount;

    return [
      {
        nebAmount,
        maxNebAmount: maxAmount,
        lockForWeeks,
        minLockForWeeks,
        maxLockForWeeks,
        txFee,
        invalidTxFee,
        invalidNebAmount,
        availableTx,
      },
      undefined,
    ];
  };
};
