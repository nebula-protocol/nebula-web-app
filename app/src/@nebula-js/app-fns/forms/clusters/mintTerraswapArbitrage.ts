import { terraswapSimulationQuery } from '@libs/app-fns';
import { FormReturn } from '@libs/use-form';
import { terraswap, u, UST } from '@nebula-js/types';
import {
  clusterMintAdvancedForm,
  ClusterMintAdvancedFormAsyncStates,
  ClusterMintAdvancedFormDependency,
  ClusterMintAdvancedFormInput,
  ClusterMintAdvancedFormStates,
} from './mintAdvanced';

export interface ClusterMintTerraswapArbitrageFormInput
  extends ClusterMintAdvancedFormInput {}

export interface ClusterMintTerraswapArbitrageFormDependency
  extends ClusterMintAdvancedFormDependency {
  terraswapPair: terraswap.factory.PairResponse;
}

export interface ClusterMintTerraswapArbitrageFormStates
  extends ClusterMintAdvancedFormStates {}

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

    const asyncStates = _asyncStates?.then((advancedAsyncStates) => {
      if (advancedAsyncStates.mintedAmount) {
        return terraswapSimulationQuery(
          dependency.terraswapPair.contract_addr,
          {
            amount: advancedAsyncStates.mintedAmount,
            info: {
              token: {
                contract_addr: dependency.clusterState.cluster_token,
              },
            },
          },
          dependency.wasmClient,
        ).then(({ simulation }) => {
          return {
            ...advancedAsyncStates,
            returnedAmount: simulation.return_amount as u<UST>,
          } as ClusterMintTerraswapArbitrageFormAsyncStates;
        });
      } else {
        return {
          ...advancedAsyncStates,
          returnedAmount: undefined,
        };
      }
    });

    return [states, asyncStates];
  };
};
