import { sum, vectorMultiply } from '@libs/big-math';
import { microfy } from '@libs/formatter';
import { MantleFetch } from '@libs/mantle';
import { FormReturn } from '@libs/use-form';
import { GasPrice } from '@libs/webapp-fns';
import { cluster, CT, NoMicro, Token, u, UST } from '@nebula-js/types';
import big, { BigSource } from 'big.js';
import { computeClusterTxFee } from '../../logics/clusters/computeClusterTxFee';
import { clusterRedeemQuery } from '../../queries/clusters/redeem';
import { ClusterFeeInput, NebulaTax } from '../../types';

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
  gasPrice: GasPrice;
  clusterFee: ClusterFeeInput;
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
      dependency.gasPrice !== prevDependency?.gasPrice ||
      input.tokenAmount !== prevInput?.tokenAmount
    ) {
      asyncStates = clusterRedeemQuery(
        input.tokenAmount,
        dependency.clusterState,
        dependency.lastSyncedHeight,
        dependency.mantleEndpoint,
        dependency.mantleFetch,
        dependency.requestInit,
      ).then(({ redeem }) => {
        const clusterTxFee = computeClusterTxFee(
          dependency.gasPrice,
          dependency.clusterFee,
          dependency.clusterState.target.length,
        );

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
