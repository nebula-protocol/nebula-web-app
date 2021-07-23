import { cluster, u, UST } from '@nebula-js/types';
import { MantleFetch } from '@terra-dev/mantle';
import { Big, BigSource } from 'big.js';
import { computeMaxUstBalanceForUstTransfer } from '../../logics/computeMaxUstBalanceForUstTransfer';
import { NebulaTax } from '../../types';

export interface ClusterMintBasicFormInput {
  ustAmount: UST;
}

export interface ClusterMintBaicFormDependency {
  mantleEndpoint: string;
  mantleFetch: MantleFetch;
  requestInit?: Omit<RequestInit, 'method' | 'body'>;
  //
  clusterState: cluster.ClusterStateResponse;
  //
  ustBalance: u<UST>;
  tax: NebulaTax;
  fixedGas: u<UST<BigSource>>;
}

export interface ClusterMintBasicFormStates extends ClusterMintBasicFormInput {
  maxUstAmount: u<UST<Big>>;
}

export interface ClusterMintBasicFormAsyncStates {}

export const clusterMintBasicForm = ({
  mantleEndpoint,
  mantleFetch,
  requestInit,
  ustBalance,
  clusterState,
  tax,
  fixedGas,
}: ClusterMintBaicFormDependency) => {
  const maxUstAmount = computeMaxUstBalanceForUstTransfer(
    ustBalance,
    tax,
    fixedGas,
  );

  return ({
    ustAmount,
  }: ClusterMintBasicFormInput): [
    ClusterMintBasicFormStates,
    Promise<ClusterMintBasicFormAsyncStates> | undefined,
  ] => {
    //if (ustAmount.length > 0) {
    //  const amountInUst = new Decimal(microfy(ustAmount).toFixed());
    //  const orderUst = Decimal.log10(amountInUst);
    //  const numChunks = Decimal.pow(10, orderUst);
    //  const ustPerChunk = amountInUst.div(numChunks);
    //  const optimalAssetAllocation = Array.from(
    //    { length: clusterState.assets.length },
    //    () => new Decimal(0),
    //  );
    //  const ustPerAsset = Array.from(
    //    { length: clusterState.assets.length },
    //    () => new Decimal(0),
    //  );
    //
    //  console.log('mintBasic.ts..()', {
    //    amountInUst: amountInUst.toFixed(),
    //    orderUst: orderUst.toFixed(),
    //    numChunks: numChunks.toFixed(),
    //    ustPerChunk: ustPerChunk.toFixed(),
    //  });
    //
    //  let i: number = -1;
    //  const imax: number = numChunks.toNumber();
    //  while (++i < imax) {
    //    let maxAssetIndex = -1;
    //    let maxClusterAmount = new Decimal(0);
    //    let bestAssetAmount = new Decimal(0);
    //
    //    let j: number = -1;
    //    const jmax: number = clusterState.assets.length;
    //    while (++j < jmax) {
    //      const asset = clusterState.assets[j];
    //      const currUstForAsset =
    //        maxAssetIndex === -1
    //          ? ustPerAsset[ustPerAsset.length - 1]
    //          : maxAssetIndex;
    //      //const beforeSimulateAmount =
    //    }
    //  }
    //}

    return [{ ustAmount, maxUstAmount }, undefined];
  };
};
