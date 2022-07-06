import { microfy } from '@libs/formatter';
import { gov, NEB, u, Luna } from '@nebula-js/types';
import { max } from '@libs/big-math';
import { FormReturn } from '@libs/use-form';
import big, { Big, BigSource } from 'big.js';
import { computeUnstakableNebBalance } from '../../logics/gov/computeUnstakableNebBalance';

export interface GovUnstakeFormInput {
  nebAmount: NEB;
}

export interface GovUnstakeFormDependency {
  lunaBalance: u<Luna<BigSource>>;
  govStaker: gov.StakerResponse | undefined;
  fixedFee: u<Luna<BigSource>>;
  connected: boolean;
}

export interface GovUnstakeFormStates extends GovUnstakeFormInput {
  maxNebAmount: u<NEB>;
  invalidTxFee: string | null;
  invalidNebAmount: string | null;
  availableTx: boolean;
  //
  txFee: u<Luna<BigSource>> | null;
  stakedNebAfterTx: u<NEB> | null;
}

export type GovUnstakeFormAsyncStates = {};

export const govUnstakeForm = ({
  lunaBalance,
  fixedFee,
  connected,
  govStaker,
}: GovUnstakeFormDependency) => {
  const unstakableNebBalance = computeUnstakableNebBalance(govStaker);
  const stakedNebBalance = govStaker?.balance;

  return ({
    nebAmount,
  }: GovUnstakeFormInput): FormReturn<
    GovUnstakeFormStates,
    GovUnstakeFormAsyncStates
  > => {
    const amountExists: boolean = nebAmount.length > 0 && big(nebAmount).gt(0);

    if (!amountExists) {
      return [
        {
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

    const txFee = fixedFee;

    const invalidTxFee =
      connected && big(txFee).gt(lunaBalance)
        ? 'Not enough transaction fees'
        : null;

    const invalidNebAmount =
      connected && big(neb).gt(unstakableNebBalance)
        ? 'Not enough assets'
        : null;

    const availableTx = connected && !invalidTxFee && !invalidNebAmount;

    return [
      {
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
