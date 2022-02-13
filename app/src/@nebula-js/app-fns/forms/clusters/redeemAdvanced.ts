import { GasPrice, TerraBalances } from '@libs/app-fns';
import { sum, vectorMultiply } from '@libs/big-math';
import { microfy } from '@libs/formatter';
import { QueryClient } from '@libs/query-client';
import { FormReturn } from '@libs/use-form';
import {
  cluster,
  CT,
  NoMicro,
  Rate,
  terraswap,
  Token,
  u,
  UST,
} from '@nebula-js/types';
import big, { BigSource } from 'big.js';
import { computeClusterTxFee } from '../../logics/clusters/computeClusterTxFee';
import { clusterRedeemQuery } from '../../queries/clusters/redeem';
import { NebulaClusterFee } from '../../types';

export interface ClusterRedeemAdvancedFormInput {
  tokenAmount: CT & NoMicro;
  addedAssets: Set<terraswap.Asset<Token>>;
  amounts: Token[];
}

export interface ClusterRedeemAdvancedFormDependency {
  queryClient: QueryClient;
  balances: TerraBalances | undefined;
  lastSyncedHeight: () => Promise<number>;
  //
  clusterState: cluster.ClusterStateResponse;
  //
  tokenBalance: u<CT>;
  taxRate: Rate;
  maxTaxUUSD: u<UST>;
  fixedFee: u<UST<BigSource>>;
  gasPrice: GasPrice;
  clusterFee: NebulaClusterFee;
}

export interface ClusterRedeemAdvancedFormStates
  extends ClusterRedeemAdvancedFormInput {
  invalidTokenAmount: string | null;
  invalidAmounts: (string | null)[];
  remainAssets: terraswap.Asset<Token>[];
  tokenBalance: u<CT>;
  balances: TerraBalances | undefined;
  txFee: u<UST> | null;
}

export interface ClusterRedeemAdvancedFormAsyncStates {
  burntTokenAmount?: u<CT>;
  redeemTokenAmounts?: u<Token>[];
  redeemValue?: u<UST>;
}

export const clusterRedeemAdvancedForm = (
  dependency: ClusterRedeemAdvancedFormDependency,
  prevDependency: ClusterRedeemAdvancedFormDependency | undefined,
) => {
  let invalidTokenAmount: string | null;
  let invalidAmounts: (string | null)[];
  let remainAssets: terraswap.Asset<Token>[];
  let asyncStates: Promise<ClusterRedeemAdvancedFormAsyncStates>;

  return (
    input: ClusterRedeemAdvancedFormInput,
    prevInput: ClusterRedeemAdvancedFormInput | undefined,
  ): FormReturn<
    ClusterRedeemAdvancedFormStates,
    ClusterRedeemAdvancedFormAsyncStates
  > => {
    if (input.tokenAmount.trim().length === 0 || big(input.tokenAmount).eq(0)) {
      return [
        {
          ...input,
          invalidTokenAmount: null,
          invalidAmounts: dependency.clusterState.target.map(() => null),
          remainAssets: dependency.clusterState.target,
          tokenBalance: dependency.tokenBalance,
          balances: dependency.balances,
          txFee: null,
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
      !invalidAmounts ||
      dependency.clusterState !== prevDependency?.clusterState ||
      dependency.balances !== prevDependency?.balances ||
      input.amounts !== prevInput?.amounts
    ) {
      invalidAmounts = dependency.clusterState.target.map(({ info }, i) => {
        const amount = input.amounts[i];
        const balance = dependency.balances?.balances[i].balance ?? 0;

        return balance && amount.length > 0 && microfy(amount).gt(balance)
          ? 'Not enough assets'
          : null;
      });
    }

    if (
      !remainAssets ||
      dependency.clusterState !== prevDependency?.clusterState ||
      input.addedAssets !== prevInput?.addedAssets
    ) {
      remainAssets = dependency.clusterState.target.filter((asset) => {
        return !input.addedAssets.has(asset);
      });
    }

    //if (
    //  !txFee ||
    //  dependency.clusterState !== prevDependency?.clusterState ||
    //  dependency.fixedGas !== prevDependency?.fixedGas ||
    //  dependency.tax !== prevDependency?.tax ||
    //  input.addedAssets !== prevInput?.addedAssets ||
    //  input.amounts !== prevInput?.amounts
    //) {
    //  if (input.addedAssets.size > 0) {
    //    const ustIndex = dependency.clusterState.target.findIndex(
    //      ({ info }) => {
    //        return (
    //          'native_token' in info &&
    //          (info.native_token.denom === 'uusd' ||
    //            info.native_token.denom === 'uust')
    //        );
    //      },
    //    );
    //
    //    if (ustIndex === -1 || input.amounts[ustIndex].length === 0) {
    //      txFee = big(dependency.fixedGas).toFixed() as u<UST>;
    //    } else {
    //      const uust = microfy(input.amounts[ustIndex]) as u<UST<Big>>;
    //      const ratioTxFee = big(uust.minus(dependency.fixedGas))
    //        .div(big(1).plus(dependency.tax.taxRate))
    //        .mul(dependency.tax.taxRate);
    //
    //      txFee = max(min(ratioTxFee, dependency.tax.maxTaxUUSD), 0)
    //        .plus(dependency.fixedGas)
    //        .toFixed() as u<UST>;
    //    }
    //  } else {
    //    txFee = null;
    //  }
    //}

    if (
      !asyncStates ||
      dependency.queryClient !== prevDependency?.queryClient ||
      dependency.lastSyncedHeight !== prevDependency?.lastSyncedHeight ||
      dependency.clusterState !== prevDependency?.clusterState ||
      dependency.clusterFee !== prevDependency?.clusterFee ||
      dependency.gasPrice !== prevDependency?.gasPrice ||
      input.tokenAmount !== prevInput?.tokenAmount
    ) {
      asyncStates = clusterRedeemQuery(
        input.tokenAmount,
        input.amounts,
        dependency.clusterState,
        dependency.lastSyncedHeight,
        dependency.queryClient,
      ).then(({ redeem }) => {
        const clusterTxFee = computeClusterTxFee(
          dependency.gasPrice,
          dependency.clusterFee.default,
          dependency.clusterState.target.length,
          dependency.clusterState.target.length,
        );

        return {
          burntTokenAmount: redeem.token_cost,
          redeemTokenAmounts: redeem.redeem_assets,
          redeemValue: sum(
            ...vectorMultiply(
              redeem.redeem_assets,
              dependency.clusterState.prices,
            ),
          ).toFixed() as u<UST>,
          txFee: clusterTxFee as u<UST>,
        };
      });
    }

    return [
      {
        ...input,
        invalidTokenAmount,
        invalidAmounts,
        remainAssets,
        balances: dependency.balances,
        tokenBalance: dependency.tokenBalance,
        txFee: null,
      },
      asyncStates,
    ];
  };
};
