import { microfy } from '@nebula-js/notation';
import { cluster, CT, terraswap, Token, u, UST } from '@nebula-js/types';
import { NebulaTax } from '@nebula-js/webapp-fns/types';
import { max, min } from '@terra-dev/big-math';
import { MantleFetch } from '@terra-dev/mantle';
import big, { Big, BigSource } from 'big.js';
import { clusterMintQuery } from '../../queries/clusters/mint';
import { TerraBalances } from '../../queries/terra/balances';

export interface ClusterMintAdvancedFormInput {
  addedAssets: Set<terraswap.Asset<Token>>;
  amounts: Token[];
}

export interface ClusterMintAdvancedFormDependency {
  mantleEndpoint: string;
  mantleFetch: MantleFetch;
  requestInit?: Omit<RequestInit, 'method' | 'body'>;
  balances: TerraBalances | undefined;
  lastSyncedHeight: () => Promise<number>;
  clusterState: cluster.ClusterStateResponse;
  fixedGas: u<UST<BigSource>>;
  tax: NebulaTax;
}

export interface ClusterMintAdvancedFormStates
  extends ClusterMintAdvancedFormInput {
  txFee: u<UST> | null;
  invalidAmounts: (string | null)[];
  remainAssets: terraswap.Asset<Token>[];
  balances: TerraBalances | undefined;
}

export interface ClusterMintAdvancedFormAsyncStates {
  mintedAmount: u<CT> | undefined;
}

export const clusterMintAdvancedForm = (
  dependency: ClusterMintAdvancedFormDependency,
  prevDependency: ClusterMintAdvancedFormDependency | undefined,
) => {
  let invalidAmounts: (string | null)[];
  let remainAssets: terraswap.Asset<Token>[];
  let asyncStates: Promise<ClusterMintAdvancedFormAsyncStates>;
  let txFee: u<UST> | null;

  return (
    input: ClusterMintAdvancedFormInput,
    prevInput: ClusterMintAdvancedFormInput | undefined,
  ): [
    ClusterMintAdvancedFormStates,
    Promise<ClusterMintAdvancedFormAsyncStates>,
  ] => {
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

    if (
      !txFee ||
      dependency.clusterState !== prevDependency?.clusterState ||
      dependency.fixedGas !== prevDependency?.fixedGas ||
      dependency.tax !== prevDependency?.tax ||
      input.addedAssets !== prevInput?.addedAssets ||
      input.amounts !== prevInput?.amounts
    ) {
      if (input.addedAssets.size > 0) {
        const ustIndex = dependency.clusterState.target.findIndex(
          ({ info }) => {
            return (
              'native_token' in info &&
              (info.native_token.denom === 'uusd' ||
                info.native_token.denom === 'uust')
            );
          },
        );

        if (ustIndex === -1 || input.amounts[ustIndex].length === 0) {
          txFee = big(dependency.fixedGas).toFixed() as u<UST>;
        } else {
          const uust = microfy(input.amounts[ustIndex]) as u<UST<Big>>;
          const ratioTxFee = big(uust.minus(dependency.fixedGas))
            .div(big(1).plus(dependency.tax.taxRate))
            .mul(dependency.tax.taxRate);

          txFee = max(min(ratioTxFee, dependency.tax.maxTaxUUSD), 0)
            .plus(dependency.fixedGas)
            .toFixed() as u<UST>;
        }
      } else {
        txFee = null;
      }
    }

    if (
      !asyncStates ||
      dependency.mantleEndpoint !== prevDependency?.mantleEndpoint ||
      dependency.lastSyncedHeight !== prevDependency?.lastSyncedHeight ||
      dependency.clusterState !== prevDependency?.clusterState ||
      input.amounts !== prevInput?.amounts
    ) {
      const hasAmounts = input.amounts.some((amount) => amount.length > 0);

      asyncStates = hasAmounts
        ? clusterMintQuery({
            mantleEndpoint: dependency.mantleEndpoint,
            mantleFetch: dependency.mantleFetch,
            requestInit: dependency.requestInit,
            lastSyncedHeight: dependency.lastSyncedHeight,
            wasmQuery: {
              mint: {
                contractAddress: dependency.clusterState.penalty,
                query: {
                  mint: {
                    block_height: -1,
                    cluster_token_supply:
                      dependency.clusterState.outstanding_balance_tokens,
                    inventory: dependency.clusterState.inv,
                    mint_asset_amounts: input.amounts.map(
                      (amount) =>
                        (amount.length > 0
                          ? microfy(amount).toFixed()
                          : '0') as u<Token>,
                    ),
                    asset_prices: dependency.clusterState.prices,
                    target_weights: dependency.clusterState.target.map(
                      ({ amount }) => amount,
                    ),
                  },
                },
              },
            },
          }).then(({ mint }) => {
            return { mintedAmount: mint.mint_tokens as u<CT> };
          })
        : Promise.resolve({ mintedAmount: undefined });
    }

    return [
      {
        ...input,
        invalidAmounts,
        remainAssets,
        balances: dependency.balances,
        txFee,
      },
      asyncStates,
    ];
  };
};