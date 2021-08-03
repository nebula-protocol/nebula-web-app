import { microfy } from '@nebula-js/notation';
import {
  cluster,
  CT,
  NativeDenom,
  NoMicro,
  terraswap,
  Token,
  u,
  UST,
} from '@nebula-js/types';
import { NebulaTax } from '@nebula-js/webapp-fns/types';
import { min, sum, vectorMultiply } from '@terra-dev/big-math';
import { MantleFetch } from '@terra-dev/mantle';
import big, { Big, BigSource } from 'big.js';
import { computeMaxUstBalanceForUstTransfer } from '../../logics/computeMaxUstBalanceForUstTransfer';
import { clusterRedeemQuery } from '../../queries/clusters/redeem';
import { terraswapSimulationQuery } from '../../queries/terraswap/simulation';

export interface ClusterRedeemTerraswapArbitrageFormInput {
  ustAmount: UST & NoMicro;
}

export interface ClusterRedeemTerraswapArbitrageFormDependency {
  mantleEndpoint: string;
  mantleFetch: MantleFetch;
  requestInit?: Omit<RequestInit, 'method' | 'body'>;
  lastSyncedHeight: () => Promise<number>;
  //
  clusterState: cluster.ClusterStateResponse;
  terraswapPair: terraswap.factory.PairResponse;
  //
  ustBalance: u<UST>;
  tax: NebulaTax;
  fixedGas: u<UST<BigSource>>;
  //
  connected: boolean;
}

export interface ClusterRedeemTerraswapArbitrageFormStates
  extends ClusterRedeemTerraswapArbitrageFormInput {
  invalidUstAmount: string | null;
  maxUstAmount: u<UST<BigSource>>;
  invalidTxFee: string | null;
}

export interface ClusterRedeemTerraswapArbitrageFormAsyncStates {
  burntTokenAmount?: u<CT>;
  redeemTokenAmounts?: u<Token>[];
  redeemValue?: u<UST>;
  txFee?: u<UST>;
}

export const clusterRedeemTerraswapArbitrageForm = (
  dependency: ClusterRedeemTerraswapArbitrageFormDependency,
  prevDependency: ClusterRedeemTerraswapArbitrageFormDependency | undefined,
) => {
  const maxUstAmount = computeMaxUstBalanceForUstTransfer(
    dependency.ustBalance,
    dependency.tax,
    dependency.fixedGas,
  );

  let invalidUstAmount: string | null;
  let asyncStates: Promise<ClusterRedeemTerraswapArbitrageFormAsyncStates>;

  return (
    input: ClusterRedeemTerraswapArbitrageFormInput,
    prevInput: ClusterRedeemTerraswapArbitrageFormInput | undefined,
  ): [
    ClusterRedeemTerraswapArbitrageFormStates,
    Promise<ClusterRedeemTerraswapArbitrageFormAsyncStates>,
  ] => {
    if (input.ustAmount.trim().length === 0 || big(input.ustAmount).eq(0)) {
      return [
        {
          ...input,
          maxUstAmount,
          invalidUstAmount: null,
          invalidTxFee: null,
        },
        Promise.resolve({}),
      ];
    }

    if (
      !invalidUstAmount ||
      dependency.ustBalance !== prevDependency?.ustBalance ||
      input.ustAmount !== prevInput?.ustAmount
    ) {
      invalidUstAmount =
        big(input.ustAmount).gt(0) && microfy(input.ustAmount).gt(maxUstAmount)
          ? 'Not enough assets'
          : null;
    }

    if (
      !asyncStates ||
      dependency.connected !== prevDependency?.connected ||
      dependency.mantleEndpoint !== prevDependency?.mantleEndpoint ||
      dependency.lastSyncedHeight !== prevDependency?.lastSyncedHeight ||
      dependency.clusterState !== prevDependency?.clusterState ||
      input.ustAmount !== prevInput?.ustAmount
    ) {
      let txFee: u<UST>;

      asyncStates = terraswapSimulationQuery({
        mantleEndpoint: dependency.mantleEndpoint,
        mantleFetch: dependency.mantleFetch,
        requestInit: dependency.requestInit,
        wasmQuery: {
          simulation: {
            contractAddress: dependency.terraswapPair.contract_addr,
            query: {
              simulation: {
                offer_asset: {
                  amount: microfy(input.ustAmount).toFixed() as u<UST>,
                  info: {
                    native_token: {
                      denom: 'uusd' as NativeDenom,
                    },
                  },
                },
              },
            },
          },
        },
      })
        .then(
          ({
            simulation: { return_amount, commission_amount, spread_amount },
          }) => {
            const _tax = min(
              microfy(input.ustAmount!).mul(dependency.tax.taxRate),
              dependency.tax.maxTaxUUSD,
            ) as u<UST<Big>>;

            txFee = _tax.plus(dependency.fixedGas).toFixed() as u<UST>;

            return clusterRedeemQuery({
              mantleEndpoint: dependency.mantleEndpoint,
              mantleFetch: dependency.mantleFetch,
              requestInit: dependency.requestInit,
              lastSyncedHeight: dependency.lastSyncedHeight,
              wasmQuery: {
                redeem: {
                  contractAddress: dependency.clusterState.penalty,
                  query: {
                    redeem: {
                      block_height: -1,
                      cluster_token_supply:
                        dependency.clusterState.outstanding_balance_tokens,
                      inventory: dependency.clusterState.inv,
                      max_tokens: return_amount as u<CT>,
                      asset_prices: dependency.clusterState.prices,
                      target_weights: dependency.clusterState.target.map(
                        ({ amount }) => amount,
                      ),
                      // TODO this field not optional
                      redeem_asset_amounts: [],
                    },
                  },
                },
              },
            });
          },
        )
        .then(({ redeem }) => {
          return {
            burntTokenAmount: redeem.token_cost,
            redeemTokenAmounts: redeem.redeem_assets,
            redeemValue: sum(
              ...vectorMultiply(
                redeem.redeem_assets,
                dependency.clusterState.prices,
              ),
            ).toFixed() as u<UST>,
            txFee,
            invalidTxFee:
              dependency.connected && big(txFee).gt(dependency.ustBalance)
                ? 'Not enough transaction fees'
                : null,
          };
        });
    }

    return [
      { ...input, maxUstAmount, invalidUstAmount, invalidTxFee: null },
      asyncStates,
    ];
  };
};
