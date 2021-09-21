import { computeMaxUstBalanceForUstTransfer, GasPrice } from '@libs/app-fns';
import { microfy } from '@libs/formatter';
import { WasmClient } from '@libs/query-client';
import { FormReturn } from '@libs/use-form';
import { cluster, CT, HumanAddr, Rate, Token, u, UST } from '@nebula-js/types';
import { BigSource } from 'big.js';
import { computeClusterTxFee } from '../../logics/clusters/computeClusterTxFee';
import { EasyMintOptimizer } from '../../logics/clusters/easyMint/EasyMintOptimizer';
import { NebulaClusterFee } from '../../types';

export interface ClusterMintBasicFormInput {
  ustAmount: UST;
}

export interface ClusterMintBaicFormDependency {
  wasmClient: WasmClient;
  //
  clusterState: cluster.ClusterStateResponse;
  terraswapFactoryAddr: HumanAddr;
  //
  ustBalance: u<UST>;
  taxRate: Rate;
  maxTaxUUSD: u<UST>;
  fixedFee: u<UST<BigSource>>;
  gasPrice: GasPrice;
  clusterFee: NebulaClusterFee;
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
  wasmClient,
  ustBalance,
  clusterState,
  terraswapFactoryAddr,
  taxRate,
  maxTaxUUSD,
  fixedFee,
  gasPrice,
  clusterFee,
}: ClusterMintBaicFormDependency) => {
  const maxUstAmount = computeMaxUstBalanceForUstTransfer(
    ustBalance,
    taxRate,
    maxTaxUUSD,
    fixedFee,
  );

  const optimizer = new EasyMintOptimizer(
    clusterState.cluster_contract_address,
    terraswapFactoryAddr,
    wasmClient,
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
