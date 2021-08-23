import { microfy } from '@libs/formatter';
import { cluster, CT, HumanAddr, Token, u, UST } from '@nebula-js/types';
import { MantleFetch } from '@libs/mantle';
import { FormReturn } from '@libs/use-form';
import { BigSource } from 'big.js';
import { EasyMintOptimizer } from '../../logics/clusters/easyMint/EasyMintOptimizer';
import { computeMaxUstBalanceForUstTransfer } from '../../logics/computeMaxUstBalanceForUstTransfer';
import { clusterTxFeeQuery } from '../../queries/clusters/clusterTxFee';
import { ClusterFee, NebulaTax } from '../../types';

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
  gasPriceEndpoint: string;
  clusterFee: ClusterFee;
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
  gasPriceEndpoint,
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
    const asyncStates = Promise.all([
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
        : Promise.resolve({}),
      clusterTxFeeQuery(
        gasPriceEndpoint,
        clusterFee,
        clusterState.target.length,
        requestInit,
      ),
    ]).then(([mintSimulation, clusterTxFee]) => {
      return {
        ...mintSimulation,
        txFee: clusterTxFee.toFixed() as u<UST>,
      };
    });

    return [{ ustAmount, maxUstAmount, txFee: null }, asyncStates];
  };
};
