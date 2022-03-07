import { GasPrice } from '@libs/app-fns';
import { QueryClient } from '@libs/query-client';
import { FormReturn } from '@libs/use-form';
import { cluster, CT, Rate, Token, u, UST } from '@nebula-js/types';
import {
  computeClusterTxFee,
  computeUTokenWithoutFee,
} from '@nebula-js/app-fns';
import { NebulaClusterFee } from '../../../types';
import { clusterMintQuery } from '@nebula-js/app-fns';

export interface ClusterMintBasicFormInput {}

export interface ClusterMintBaicFormDependency {
  queryClient: QueryClient;
  providedAmounts: u<Token>[];
  lastSyncedHeight: () => Promise<number>;
  clusterState: cluster.ClusterStateResponse;
  protocolFee: Rate;
  gasPrice: GasPrice;
  clusterFee: NebulaClusterFee;
}

export interface ClusterMintBasicFormStates extends ClusterMintBasicFormInput {
  providedAmounts: u<Token>[];
  txFee: u<UST> | null;
}

export interface ClusterMintBasicFormAsyncStates {
  mintedAmount?: u<CT>;
}

export const clusterMintBasicForm = ({
  queryClient,
  clusterState,
  protocolFee,
  providedAmounts,
  lastSyncedHeight,
  gasPrice,
  clusterFee,
}: ClusterMintBaicFormDependency) => {
  return (): FormReturn<
    ClusterMintBasicFormStates,
    ClusterMintBasicFormAsyncStates
  > => {
    // TODO
    const clusterTxFee = computeClusterTxFee(
      gasPrice,
      clusterFee.default,
      clusterState.target.length,
      clusterState.target.length,
    );

    const asyncStates = clusterMintQuery(
      providedAmounts,
      clusterState,
      lastSyncedHeight,
      queryClient,
    ).then(({ mint }) => {
      const mintedAmountWithoutFee = computeUTokenWithoutFee(
        mint.create_tokens as u<CT>,
        protocolFee,
      );

      return {
        mintedAmount: mintedAmountWithoutFee,
        txFee: clusterTxFee,
      };
    });

    return [
      {
        providedAmounts,
        txFee: null,
      },
      asyncStates,
    ];
  };
};
