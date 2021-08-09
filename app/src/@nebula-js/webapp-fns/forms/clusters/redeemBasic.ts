import { microfy } from '@nebula-js/notation';
import { cluster, CT, NoMicro, Token, u, UST } from '@nebula-js/types';
import { NebulaTax } from '@nebula-js/webapp-fns/types';
import { sum, vectorMultiply } from '@terra-dev/big-math';
import { MantleFetch } from '@terra-dev/mantle';
import big, { BigSource } from 'big.js';
import { clusterRedeemQuery } from '../../queries/clusters/redeem';

export interface ClusterRedeemBasicFormInput {
  tokenAmount: CT & NoMicro;
}

export interface ClusterRedeemBasicFormDependency {
  mantleEndpoint: string;
  mantleFetch: MantleFetch;
  requestInit?: Omit<RequestInit, 'method' | 'body'>;
  lastSyncedHeight: () => Promise<number>;
  //
  clusterState: cluster.ClusterStateResponse;
  //
  tokenBalance: u<CT>;
  tax: NebulaTax;
  fixedGas: u<UST<BigSource>>;
}

export interface ClusterRedeemBasicFormStates
  extends ClusterRedeemBasicFormInput {
  invalidTokenAmount: string | null;
  tokenBalance: u<CT>;
}

export interface ClusterRedeemBasicFormAsyncStates {
  burntTokenAmount?: u<CT>;
  redeemTokenAmounts?: u<Token>[];
  redeemValue?: u<UST>;
}

export const clusterRedeemBasicForm = (
  dependency: ClusterRedeemBasicFormDependency,
  prevDependency: ClusterRedeemBasicFormDependency | undefined,
) => {
  let invalidTokenAmount: string | null;
  let asyncStates: Promise<ClusterRedeemBasicFormAsyncStates>;

  return (
    input: ClusterRedeemBasicFormInput,
    prevInput: ClusterRedeemBasicFormInput | undefined,
  ): [
    ClusterRedeemBasicFormStates,
    Promise<ClusterRedeemBasicFormAsyncStates>,
  ] => {
    if (input.tokenAmount.trim().length === 0 || big(input.tokenAmount).eq(0)) {
      return [
        {
          ...input,
          tokenBalance: dependency.tokenBalance,
          invalidTokenAmount: null,
        },
        Promise.resolve({}),
      ];
    }

    if (
      !invalidTokenAmount ||
      dependency.tokenBalance !== prevDependency?.tokenBalance ||
      input.tokenAmount !== prevInput?.tokenAmount
    ) {
      invalidTokenAmount =
        big(input.tokenAmount).gt(0) &&
        microfy(input.tokenAmount).gt(dependency.tokenBalance)
          ? 'Not enough assets'
          : null;
    }

    if (
      !asyncStates ||
      dependency.mantleEndpoint !== prevDependency?.mantleEndpoint ||
      dependency.lastSyncedHeight !== prevDependency?.lastSyncedHeight ||
      dependency.clusterState !== prevDependency?.clusterState ||
      input.tokenAmount !== prevInput?.tokenAmount
    ) {
      asyncStates = clusterRedeemQuery(
        input.tokenAmount,
        dependency.clusterState,
        dependency.lastSyncedHeight,
        dependency.mantleEndpoint,
        dependency.mantleFetch,
        dependency.requestInit,
      ).then(({ redeem }) => {
        return {
          burntTokenAmount: redeem.token_cost,
          redeemTokenAmounts: redeem.redeem_assets,
          redeemValue: sum(
            ...vectorMultiply(
              redeem.redeem_assets,
              dependency.clusterState.prices,
            ),
          ).toFixed() as u<UST>,
        };
      });
    }

    return [
      { ...input, tokenBalance: dependency.tokenBalance, invalidTokenAmount },
      asyncStates,
    ];
  };
};
