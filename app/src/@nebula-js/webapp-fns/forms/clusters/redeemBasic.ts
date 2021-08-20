import { microfy } from '@nebula-js/notation';
import { cluster, CT, NoMicro, Token, u, UST } from '@nebula-js/types';
import { sum, vectorMultiply } from '@terra-dev/big-math';
import { MantleFetch } from '@terra-dev/mantle';
import { FormReturn } from '@terra-dev/use-form';
import big, { BigSource } from 'big.js';
import { clusterTxFeeQuery } from '../../queries/clusters/clusterTxFee';
import { clusterRedeemQuery } from '../../queries/clusters/redeem';
import { ClusterFee, NebulaTax } from '../../types';

export interface ClusterRedeemBasicFormInput {
  tokenAmount: CT & NoMicro;
}

export interface ClusterRedeemBasicFormDependency {
  mantleEndpoint: string;
  mantleFetch: MantleFetch;
  requestInit?: Omit<RequestInit, 'method' | 'body'>;
  lastSyncedHeight: () => Promise<number>;
  //
  clusterState: cluster.ClusterStateResponse;
  //
  tokenBalance: u<CT>;
  tax: NebulaTax;
  fixedGas: u<UST<BigSource>>;
  gasPriceEndpoint: string;
  clusterFee: ClusterFee;
}

export interface ClusterRedeemBasicFormStates
  extends ClusterRedeemBasicFormInput {
  invalidTokenAmount: string | null;
  tokenBalance: u<CT>;
  txFee: u<UST> | null;
}

export interface ClusterRedeemBasicFormAsyncStates {
  burntTokenAmount?: u<CT>;
  redeemTokenAmounts?: u<Token>[];
  redeemValue?: u<UST>;
}

export const clusterRedeemBasicForm = (
  dependency: ClusterRedeemBasicFormDependency,
  prevDependency: ClusterRedeemBasicFormDependency | undefined,
) => {
  let invalidTokenAmount: string | null;
  let asyncStates: Promise<ClusterRedeemBasicFormAsyncStates>;

  return (
    input: ClusterRedeemBasicFormInput,
    prevInput: ClusterRedeemBasicFormInput | undefined,
  ): FormReturn<
    ClusterRedeemBasicFormStates,
    ClusterRedeemBasicFormAsyncStates
  > => {
    if (input.tokenAmount.trim().length === 0 || big(input.tokenAmount).eq(0)) {
      return [
        {
          ...input,
          tokenBalance: dependency.tokenBalance,
          invalidTokenAmount: null,
          txFee: null,
        },
        Promise.resolve({}),
      ];
    }

    if (
      !invalidTokenAmount ||
      dependency.tokenBalance !== prevDependency?.tokenBalance ||
      input.tokenAmount !== prevInput?.tokenAmount
    ) {
      invalidTokenAmount =
        big(input.tokenAmount).gt(0) &&
        microfy(input.tokenAmount).gt(dependency.tokenBalance)
          ? 'Not enough assets'
          : null;
    }

    if (
      !asyncStates ||
      dependency.mantleEndpoint !== prevDependency?.mantleEndpoint ||
      dependency.lastSyncedHeight !== prevDependency?.lastSyncedHeight ||
      dependency.clusterState !== prevDependency?.clusterState ||
      dependency.clusterFee !== prevDependency?.clusterFee ||
      input.tokenAmount !== prevInput?.tokenAmount
    ) {
      asyncStates = Promise.all([
        clusterRedeemQuery(
          input.tokenAmount,
          dependency.clusterState,
          dependency.lastSyncedHeight,
          dependency.mantleEndpoint,
          dependency.mantleFetch,
          dependency.requestInit,
        ),
        clusterTxFeeQuery(
          dependency.gasPriceEndpoint,
          dependency.clusterFee,
          dependency.clusterState.target.length,
          dependency.requestInit,
        ),
      ]).then(([{ redeem }, clusterTxFee]) => {
        return {
          burntTokenAmount: redeem.token_cost,
          redeemTokenAmounts: redeem.redeem_assets,
          redeemValue: sum(
            ...vectorMultiply(
              redeem.redeem_assets,
              dependency.clusterState.prices,
            ),
          ).toFixed() as u<UST>,
          txFee: clusterTxFee.toFixed() as u<UST>,
        };
      });
    }

    return [
      {
        ...input,
        tokenBalance: dependency.tokenBalance,
        invalidTokenAmount,
        txFee: null,
      },
      asyncStates,
    ];
  };
};
