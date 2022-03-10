import { GasPrice } from '@libs/app-fns';
import { vectorDot } from '@libs/big-math';
import { microfy } from '@libs/formatter';
import { QueryClient } from '@libs/query-client';
import { FormReturn } from '@libs/use-form';
import { cluster, CT, NoMicro, Rate, Token, u, UST } from '@nebula-js/types';
import big from 'big.js';
import {
  computeClusterTxFee,
  computeTokenWithoutFee,
} from '@nebula-js/app-fns';
import { clusterRedeemQuery } from '../../queries/clusters/redeem';
import { NebulaClusterFee } from '../../types';

export interface ClusterRedeemBasicFormInput {
  tokenAmount: CT & NoMicro;
}

export interface ClusterRedeemBasicFormDependency {
  queryClient: QueryClient;
  lastSyncedHeight: () => Promise<number>;
  //
  clusterState: cluster.ClusterStateResponse;
  protocolFee: Rate;
  //
  tokenBalance: u<CT>;
  gasPrice: GasPrice;
  clusterFee: NebulaClusterFee;
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
  totalRedeemValue?: u<UST>;
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
      dependency.queryClient !== prevDependency?.queryClient ||
      dependency.lastSyncedHeight !== prevDependency?.lastSyncedHeight ||
      dependency.clusterState !== prevDependency?.clusterState ||
      dependency.clusterFee !== prevDependency?.clusterFee ||
      dependency.gasPrice !== prevDependency?.gasPrice ||
      input.tokenAmount !== prevInput?.tokenAmount
    ) {
      const tokenAmountWithoutFee = computeTokenWithoutFee(
        input.tokenAmount,
        dependency.protocolFee,
      );

      asyncStates = clusterRedeemQuery(
        tokenAmountWithoutFee,
        [],
        dependency.clusterState,
        dependency.lastSyncedHeight,
        dependency.queryClient,
      ).then(({ redeem }) => {
        const clusterTxFee = computeClusterTxFee(
          dependency.gasPrice,
          dependency.clusterFee.default,
          dependency.clusterState.target.length,
          dependency.clusterState.target.length,
        );

        return {
          burntTokenAmount: microfy(input.tokenAmount).toFixed() as u<CT>,
          redeemTokenAmounts: redeem.redeem_assets,
          totalRedeemValue: vectorDot(
            redeem.redeem_assets,
            dependency.clusterState.prices,
          ).toFixed() as u<UST>,
          txFee: clusterTxFee as u<UST>,
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
