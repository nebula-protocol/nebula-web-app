import { microfy } from '@nebula-js/notation';
import { gov, NEB, u, UST } from '@nebula-js/types';
import { max } from '@terra-dev/big-math';
import { FormReturn } from '@terra-dev/use-form';
import big, { Big, BigSource } from 'big.js';
import { computeUnstakableNebBalance } from '../../logics/gov/computeUnstakableNebBalance';

export interface GovUnstakeFormInput {
  nebAmount: NEB;
}

export interface GovUnstakeFormDependency {
  ustBalance: u<UST<BigSource>>;
  govStaker: gov.StakerResponse | undefined;
  fixedGas: u<UST<BigSource>>;
  connected: boolean;
}

export interface GovUnstakeFormStates extends GovUnstakeFormInput {
  remainLockWeeks: number;
  maxNebAmount: u<NEB>;
  invalidTxFee: string | null;
  invalidNebAmount: string | null;
  availableTx: boolean;
  //
  txFee: u<UST<BigSource>> | null;
  stakedNebAfterTx: u<NEB> | null;
}

export type GovUnstakeFormAsyncStates = {};

export const govUnstakeForm = ({
  ustBalance,
  fixedGas,
  connected,
  govStaker,
}: GovUnstakeFormDependency) => {
  const unstakableNebBalance = computeUnstakableNebBalance(govStaker);
  const stakedNebBalance = govStaker?.balance;

  const remainLockWeeks = govStaker?.lock_end_week
    ? govStaker.lock_end_week -
      Math.floor(Date.now() / (1000 * 60 * 60 * 24 * 7))
    : 0;

  return ({
    nebAmount,
  }: GovUnstakeFormInput): FormReturn<
    GovUnstakeFormStates,
    GovUnstakeFormAsyncStates
  > => {
    if (remainLockWeeks > 0) {
      return [
        {
          remainLockWeeks,
          nebAmount,
          maxNebAmount: unstakableNebBalance,
          txFee: null,
          invalidNebAmount: null,
          invalidTxFee: null,
          availableTx: false,
          stakedNebAfterTx: null,
        },
        undefined,
      ];
    }

    const amountExists: boolean = nebAmount.length > 0 && big(nebAmount).gt(0);

    if (!amountExists) {
      return [
        {
          remainLockWeeks: 0,
          nebAmount,
          maxNebAmount: unstakableNebBalance,
          txFee: null,
          invalidNebAmount: null,
          invalidTxFee: null,
          availableTx: false,
          stakedNebAfterTx: null,
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
      connected && big(neb).gt(unstakableNebBalance)
        ? 'Not enough assets'
        : null;

    const availableTx = connected && !invalidTxFee && !invalidNebAmount;

    return [
      {
        remainLockWeeks: 0,
        nebAmount,
        maxNebAmount: unstakableNebBalance,
        txFee,
        invalidTxFee,
        invalidNebAmount,
        availableTx,
        stakedNebAfterTx: max(
          big(stakedNebBalance ?? 0).minus(neb),
          0,
        ).toFixed() as u<NEB>,
      },
      undefined,
    ];
  };
};
