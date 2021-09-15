import { microfy } from '@libs/formatter';
import { MantleFetch } from '@libs/mantle';
import { FormReturn } from '@libs/use-form';
import { computeMaxUstBalanceForUstTransfer, GasPrice } from '@libs/webapp-fns';
import { cluster, CT, HumanAddr, Token, u, UST } from '@nebula-js/types';
import { BigSource } from 'big.js';
import { computeClusterTxFee } from '../../logics/clusters/computeClusterTxFee';
import { EasyMintOptimizer } from '../../logics/clusters/easyMint/EasyMintOptimizer';
import { ClusterFeeInput, NebulaTax } from '../../types';

export interface ClusterMintBasicFormInput {
  ustAmount: UST;
}

export interface ClusterMintBaicFormDependency {
  mantleEndpoint: string;
  mantleFetch: MantleFetch;
  requestInit?: Omit<RequestInit, 'method' | 'body'>;
  //
  clusterState: cluster.ClusterStateResponse;
  terraswapFactoryAddr: HumanAddr;
  //
  ustBalance: u<UST>;
  tax: NebulaTax;
  fixedGas: u<UST<BigSource>>;
  gasPrice: GasPrice;
  clusterFee: ClusterFeeInput;
}

export interface ClusterMintBasicFormStates extends ClusterMintBasicFormInput {
  maxUstAmount: u<UST<BigSource>>;
  txFee: u<UST> | null;
}

export interface ClusterMintBasicFormAsyncStates {
  providedAmounts?: u<Token>[];
  mintedAmount?: u<CT>;
}

export const clusterMintBasicForm = ({
  mantleEndpoint,
  mantleFetch,
  requestInit,
  ustBalance,
  clusterState,
  terraswapFactoryAddr,
  tax,
  fixedGas,
  gasPrice,
  clusterFee,
}: ClusterMintBaicFormDependency) => {
  const maxUstAmount = computeMaxUstBalanceForUstTransfer(
    ustBalance,
    tax,
    fixedGas,
  );

  const optimizer = new EasyMintOptimizer(
    clusterState.cluster_contract_address,
    terraswapFactoryAddr,
    mantleEndpoint,
    mantleFetch,
    requestInit,
  );

  optimizer.resetInitialState();

  return ({
    ustAmount,
  }: ClusterMintBasicFormInput): FormReturn<
    ClusterMintBasicFormStates,
    ClusterMintBasicFormAsyncStates
  > => {
    const clusterTxFee = computeClusterTxFee(
      gasPrice,
      clusterFee.default,
      clusterState.target.length,
      clusterState.target.length,
    );

    const asyncStates =
      ustAmount.length > 0
        ? optimizer
            .resetInitialState()
            .then(() => {
              return optimizer.findOptimalAllocation(microfy(ustAmount));
            })
            .then((result) => {
              if (!result) {
                return {};
              }

              console.table({
                optimalAssetAllocation: result.optimalAssetAllocation.map((n) =>
                  n.toFixed(),
                ),
                uusdPerAsset: result.uusdPerAsset.map((n) => n.toFixed()),
                expectedClusterTokens: result.expectedClusterTokens.toFixed(),
              });
              return {
                providedAmounts: result.optimalAssetAllocation.map((n) =>
                  n.toFixed(),
                ) as u<Token>[],
                mintedAmount: result.expectedClusterTokens.toFixed() as u<CT>,
              };
            })
            .then((mintSimulation) => {
              return {
                ...mintSimulation,
                txFee: clusterTxFee,
              };
            })
        : Promise.resolve({});

    return [{ ustAmount, maxUstAmount, txFee: null }, asyncStates];
  };
};
