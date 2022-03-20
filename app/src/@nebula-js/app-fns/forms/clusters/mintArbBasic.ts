import { GasPrice } from '@libs/app-fns';
import { FormReturn } from '@libs/use-form';
import { cluster, u, UST, Rate, Token } from '@nebula-js/types';
import { computeClusterTxFee } from '@nebula-js/app-fns';
import { NebulaClusterFee } from '../../types';
import { GetMintArbTxInfoResponse } from '@nebula-js/app-provider';

export interface ClusterMintArbBasicFormInput {
  maxSpread: Rate;
}

export interface ClusterMintArbBasicFormDependency {
  clusterState: cluster.ClusterStateResponse;
  providedAmounts: u<Token>[];
  mintArbInfoTx: GetMintArbTxInfoResponse;
  gasPrice: GasPrice;
  clusterFee: NebulaClusterFee;
}

export interface ClusterMintArbBasicFormStates
  extends ClusterMintArbBasicFormInput {
  providedAmounts: u<Token>[];
  txFee: u<UST> | null;
}

export interface ClusterMintArbBasicFormAsyncStates {
  totalInputValue?: u<UST>;
  pnl?: u<UST>;
  returnedAmount?: u<UST>;
}

export const clusterMintArbBasicForm = (
  dependency: ClusterMintArbBasicFormDependency,
  prevDependency: ClusterMintArbBasicFormDependency | undefined,
) => {
  let asyncStates: Promise<ClusterMintArbBasicFormAsyncStates>;

  return (
    input: ClusterMintArbBasicFormInput,
    prevInput: ClusterMintArbBasicFormInput | undefined,
  ): FormReturn<
    ClusterMintArbBasicFormStates,
    ClusterMintArbBasicFormAsyncStates
  > => {
    if (
      !asyncStates ||
      dependency.clusterState !== prevDependency?.clusterState ||
      dependency.clusterFee !== prevDependency?.clusterFee ||
      dependency.gasPrice !== prevDependency?.gasPrice ||
      dependency.providedAmounts !== prevDependency.providedAmounts ||
      dependency.mintArbInfoTx !== prevDependency.mintArbInfoTx ||
      input.maxSpread !== prevInput?.maxSpread
    ) {
      asyncStates = dependency
        .mintArbInfoTx(dependency.providedAmounts, input.maxSpread)
        .then(({ totalInputValue, pnl, minReceivedUust }) => {
          const clusterTxFee = computeClusterTxFee(
            dependency.gasPrice,
            dependency.clusterFee.arbMint,
            dependency.clusterState.target.length,
            dependency.clusterState.target.length,
          );

          return {
            totalInputValue,
            pnl,
            returnedAmount: minReceivedUust,
            txFee: clusterTxFee,
          };
        });
    }

    return [
      {
        providedAmounts: dependency.providedAmounts,
        maxSpread: input.maxSpread,
        txFee: null,
      },
      asyncStates,
    ];
  };
};
