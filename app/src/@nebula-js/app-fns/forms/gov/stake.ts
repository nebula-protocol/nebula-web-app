import { microfy } from '@libs/formatter';
import { gov, NEB, u, Luna } from '@nebula-js/types';
import { FormReturn } from '@libs/use-form';
import big, { Big, BigSource } from 'big.js';

export interface GovStakeFormInput {
  nebAmount: NEB;
}

export interface GovStakeFormDependency {
  nebBalance: u<NEB>;
  lunaBalance: u<Luna<BigSource>>;
  fixedFee: u<Luna<BigSource>>;
  connected: boolean;
  govStaker: gov.StakerResponse | undefined;
}

export interface GovStakeFormStates extends GovStakeFormInput {
  maxNebAmount: u<NEB>;
  invalidTxFee: string | null;
  invalidNebAmount: string | null;
  availableTx: boolean;
  //
  txFee: u<Luna<BigSource>> | null;
  stakedNebAfterTx: u<NEB> | null;
}

export type GovStakeFormAsyncStates = {};

export const govStakeForm = ({
  nebBalance,
  lunaBalance,
  fixedFee,
  connected,
  govStaker,
}: GovStakeFormDependency) => {
  const maxAmount = nebBalance;
  const stakedNebBalance = govStaker?.balance;

  return ({
    nebAmount,
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
      connected && big(neb).gt(nebBalance) ? 'Not enough assets' : null;

    const availableTx = connected && !invalidTxFee && !invalidNebAmount;

    return [
      {
        nebAmount,
        maxNebAmount: maxAmount,
        txFee,
        invalidTxFee,
        invalidNebAmount,
        availableTx,
        stakedNebAfterTx: big(stakedNebBalance ?? '0')
          .plus(neb)
          .toFixed() as u<NEB>,
      },
      undefined,
    ];
  };
};
