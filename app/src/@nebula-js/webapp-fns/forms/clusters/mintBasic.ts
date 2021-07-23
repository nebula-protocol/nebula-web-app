import { u, UST } from '@nebula-js/types';
import { NebulaTax } from '@nebula-js/webapp-fns/types';
import { MantleFetch } from '@terra-dev/mantle';
import { Big, BigSource } from 'big.js';
import { computeMaxUstBalanceForUstTransfer } from '../../logics/computeMaxUstBalanceForUstTransfer';

export interface ClusterMintBasicFormInput {
  ustAmount: UST;
}

export interface ClusterMintBaicFormDependency {
  mantleEndpoint: string;
  mantleFetch: MantleFetch;
  requestInit?: Omit<RequestInit, 'method' | 'body'>;
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
    return [{ ustAmount, maxUstAmount }, undefined];
  };
};
