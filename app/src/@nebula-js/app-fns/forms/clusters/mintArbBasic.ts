import { GasPrice } from '@libs/app-fns';
import { terraswapSimulationQuery } from '@libs/app-fns';
import { FormReturn } from '@libs/use-form';
import { cluster, terraswap, u, CT, UST, Rate, Token } from '@nebula-js/types';
import big, { Big, BigSource } from 'big.js';
import { QueryClient } from '@libs/query-client';
import {
  computeClusterTxFee,
  computeMinReceivedAmount,
} from '@nebula-js/app-fns';
import { NebulaClusterFee } from '../../types';
import { clusterMintQuery } from '@nebula-js/app-fns/queries/clusters/mint';
import { computeUTokenWithoutFee } from '@nebula-js/app-fns/logics/clusters/computeTokenWithoutFee';
import { vectorDot } from '@libs/big-math';

export interface ClusterMintArbBasicFormInput {
  maxSpread: Rate;
}

export interface ClusterMintArbBasicFormDependency {
  queryClient: QueryClient;
  lastSyncedHeight: () => Promise<number>;
  clusterState: cluster.ClusterStateResponse;
  providedAmounts: u<Token>[];
  terraswapPair: terraswap.factory.PairResponse;
  terraswapPool: terraswap.pair.PoolResponse<CT, UST>;
  protocolFee: Rate;
  gasPrice: GasPrice;
  clusterFee: NebulaClusterFee;
  fixedFee: u<UST<BigSource>>;
}

export interface ClusterMintArbBasicFormStates
  extends ClusterMintArbBasicFormInput {
  providedAmounts: u<Token>[];
  txFee: u<UST> | null;
}

export interface ClusterMintArbBasicFormAsyncStates {
  totalInputValue?: u<UST<Big>>;
  pnl: u<UST> | undefined;
  returnedAmount: u<UST> | undefined;
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
    const clusterTxFee = computeClusterTxFee(
      dependency.gasPrice,
      dependency.clusterFee.arbMint,
      dependency.clusterState.target.length,
      dependency.clusterState.target.length,
    );

    if (
      !asyncStates ||
      dependency.queryClient !== prevDependency?.queryClient ||
      dependency.lastSyncedHeight !== prevDependency?.lastSyncedHeight ||
      dependency.clusterState !== prevDependency?.clusterState ||
      dependency.terraswapPool !== prevDependency?.terraswapPool ||
      dependency.clusterFee !== prevDependency?.clusterFee ||
      dependency.gasPrice !== prevDependency?.gasPrice ||
      dependency.providedAmounts !== prevDependency.providedAmounts ||
      dependency.protocolFee !== prevDependency.protocolFee ||
      input.maxSpread !== prevInput?.maxSpread
    ) {
      asyncStates = clusterMintQuery(
        dependency.providedAmounts,
        dependency.clusterState,
        dependency.lastSyncedHeight,
        dependency.queryClient,
      ).then(async ({ mint }) => {
        const mintedAmountWithoutFee = computeUTokenWithoutFee(
          mint.create_tokens as u<CT>,
          dependency.protocolFee,
        );

        const {
          simulation: { return_amount },
        } = await terraswapSimulationQuery(
          dependency.terraswapPair.contract_addr,
          {
            amount: mintedAmountWithoutFee,
            info: {
              token: {
                contract_addr: dependency.clusterState.cluster_token,
              },
            },
          },
          dependency.queryClient,
        );

        const minReceivedUust = computeMinReceivedAmount(
          return_amount as u<UST>,
          input.maxSpread,
        );

        const totalInputValue = vectorDot(
          dependency.providedAmounts,
          dependency.clusterState.prices,
        ) as u<UST<Big>>;

        return {
          totalInputValue,
          pnl: big(minReceivedUust).minus(totalInputValue).toFixed() as u<UST>,
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
