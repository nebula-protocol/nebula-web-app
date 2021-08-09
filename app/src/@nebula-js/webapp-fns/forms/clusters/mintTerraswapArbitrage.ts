import { terraswap, u, UST } from '@nebula-js/types';
import { terraswapSimulationQuery } from '../../queries/terraswap/simulation';
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
  ): [
    ClusterMintTerraswapArbitrageFormStates,
    Promise<ClusterMintTerraswapArbitrageFormAsyncStates>,
  ] => {
    const [states, _asyncStates] = dep(input, prevInput);

    const asyncStates = _asyncStates.then(({ mintedAmount }) => {
      if (mintedAmount) {
        return terraswapSimulationQuery(
          dependency.terraswapPair.contract_addr,
          {
            amount: mintedAmount,
            info: {
              token: {
                contract_addr: dependency.clusterState.cluster_token,
              },
            },
          },
          dependency.mantleEndpoint,
          dependency.mantleFetch,
          dependency.requestInit,
        ).then(({ simulation }) => {
          return {
            mintedAmount,
            returnedAmount: simulation.return_amount as u<UST>,
          } as ClusterMintTerraswapArbitrageFormAsyncStates;
        });
      } else {
        return {
          mintedAmount,
          returnedAmount: undefined,
        };
      }
    });

    return [states, asyncStates];
  };
};
