import { terraswapSimulationQuery } from '@libs/app-fns';
import { FormReturn } from '@libs/use-form';
import { terraswap, u, UST, Rate } from '@nebula-js/types';
import {
  clusterMintAdvancedForm,
  ClusterMintAdvancedFormAsyncStates,
  ClusterMintAdvancedFormDependency,
  ClusterMintAdvancedFormInput,
  ClusterMintAdvancedFormStates,
} from './mintAdvanced';
import big from 'big.js';
import { computeClusterTxFee } from '@nebula-js/app-fns';
import { computeMinReceivedAmount } from '@nebula-js/app-fns';

export interface ClusterMintArbAdvancedFormInput
  extends ClusterMintAdvancedFormInput {
  maxSpread: Rate;
}

export interface ClusterMintArbAdvancedFormDependency
  extends ClusterMintAdvancedFormDependency {
  terraswapPair: terraswap.factory.PairResponse;
}

export interface ClusterMintArbAdvancedFormStates
  extends ClusterMintAdvancedFormStates,
    ClusterMintArbAdvancedFormInput {}

export interface ClusterMintArbAdvancedFormAsyncStates
  extends ClusterMintAdvancedFormAsyncStates {
  returnedAmount: u<UST> | undefined;
}

export const clusterMintArbAdvancedForm = (
  dependency: ClusterMintArbAdvancedFormDependency,
  prevDependency: ClusterMintArbAdvancedFormDependency | undefined,
) => {
  const dep = clusterMintAdvancedForm(dependency, prevDependency);

  return (
    input: ClusterMintArbAdvancedFormInput,
    prevInput: ClusterMintArbAdvancedFormInput | undefined,
  ): FormReturn<
    ClusterMintArbAdvancedFormStates,
    ClusterMintArbAdvancedFormAsyncStates
  > => {
    const [states, _asyncStates] = dep(input, prevInput);
    const clusterTxFee = computeClusterTxFee(
      dependency.gasPrice,
      dependency.clusterFee.arbMint,
      dependency.clusterState.target.length,
      dependency.clusterState.target.length,
    );

    // TODO: use mintArbTxInfo here
    const asyncStates = _asyncStates?.then(async (advancedAsyncStates) => {
      if (advancedAsyncStates.mintedAmount) {
        const {
          simulation: { return_amount },
        } = await terraswapSimulationQuery(
          dependency.terraswapPair.contract_addr,
          {
            amount: advancedAsyncStates.mintedAmount,
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

        const pnl = big(minReceivedUust)
          .minus(advancedAsyncStates.totalInputValue!)
          .toFixed() as u<UST>;

        return {
          ...advancedAsyncStates,
          returnedAmount: minReceivedUust,
          pnl,
          txFee: clusterTxFee,
        } as ClusterMintArbAdvancedFormAsyncStates;
      } else {
        return {
          ...advancedAsyncStates,
          returnedAmount: undefined,
        };
      }
    });

    return [{ ...states, maxSpread: input.maxSpread }, asyncStates];
  };
};
