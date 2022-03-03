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
import { computeMinReceivedUUST } from '@nebula-js/app-fns';

export interface ClusterMintTerraswapArbitrageFormInput
  extends ClusterMintAdvancedFormInput {
  maxSpread: Rate;
}

export interface ClusterMintTerraswapArbitrageFormDependency
  extends ClusterMintAdvancedFormDependency {
  terraswapPair: terraswap.factory.PairResponse;
}

export interface ClusterMintTerraswapArbitrageFormStates
  extends ClusterMintAdvancedFormStates,
    ClusterMintTerraswapArbitrageFormInput {}

export interface ClusterMintTerraswapArbitrageFormAsyncStates
  extends ClusterMintAdvancedFormAsyncStates {
  returnedAmount: u<UST> | undefined;
}

export const clusterMintTerraswapArbitrageForm = (
  dependency: ClusterMintTerraswapArbitrageFormDependency,
  prevDependency: ClusterMintTerraswapArbitrageFormDependency | undefined,
) => {
  const dep = clusterMintAdvancedForm(dependency, prevDependency);

  return (
    input: ClusterMintTerraswapArbitrageFormInput,
    prevInput: ClusterMintTerraswapArbitrageFormInput | undefined,
  ): FormReturn<
    ClusterMintTerraswapArbitrageFormStates,
    ClusterMintTerraswapArbitrageFormAsyncStates
  > => {
    const [states, _asyncStates] = dep(input, prevInput);
    const clusterTxFee = computeClusterTxFee(
      dependency.gasPrice,
      dependency.clusterFee.arbMint,
      dependency.clusterState.target.length,
      dependency.clusterState.target.length,
    );

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

        const minReceivedUust = computeMinReceivedUUST(
          advancedAsyncStates.mintedAmount,
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
        } as ClusterMintTerraswapArbitrageFormAsyncStates;
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
