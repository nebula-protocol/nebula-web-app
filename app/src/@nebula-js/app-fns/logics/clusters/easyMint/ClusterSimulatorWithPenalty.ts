import {
  abs,
  exp,
  max,
  min,
  sum,
  vectorDot,
  vectorMinus,
  vectorMultiply,
  vectorPlus,
} from '@libs/big-math';
import { QueryClient } from '@libs/query-client';
import {
  cluster,
  CT,
  HumanAddr,
  Num,
  penalty,
  terraswap,
  Token,
  u,
} from '@nebula-js/types';
import big, { Big, BigSource } from 'big.js';
import { clusterPenaltyParamsQuery } from '../../../queries/clusters/penaltyParams';
import { clusterStateQuery } from '../../../queries/clusters/state';

/* eslint-disable @typescript-eslint/no-shadow */

// https://github.com/nebula-protocol/nebula-contracts/blob/develop/deploy-scripts/simulation_cluster_ops.py
export class ClusterSimulatorWithPenalty {
  public clusterState!: cluster.ClusterStateResponse;
  public penaltyInfo!: penalty.ParamsResponse;
  public targetAssets!: terraswap.AssetInfo[];
  public targetAmounts!: u<Token>[];
  private lastBlock: number = 0;

  constructor(private clusterAddr: HumanAddr, private queryClient: QueryClient) {}

  resetInitialState = async () => {
    const { clusterState } = await clusterStateQuery(
      this.clusterAddr,
      this.queryClient,
    );
    this.clusterState = clusterState;

    this.targetAssets = clusterState.target.map(({ info }) => info);
    this.targetAmounts = clusterState.target.map(({ amount }) => amount);

    const { penaltyParams } = await clusterPenaltyParamsQuery(
      clusterState.penalty,
      this.queryClient,
    );
    this.penaltyInfo = penaltyParams;

    this.lastBlock = penaltyParams.last_block;
  };

  imbalance = (inv: u<Token<BigSource>>[]) => {
    const wp = vectorDot(this.targetAmounts, this.clusterState.prices);
    const u = vectorMultiply(this.targetAmounts, this.clusterState.prices);

    const ip = vectorDot(inv, this.clusterState.prices);
    const v = vectorMultiply(inv, this.clusterState.prices);

    const errPortfolio = vectorMinus(
      vectorMultiply(u, ip),
      vectorMultiply(wp, v),
    );
    return sum(...errPortfolio.map(abs)).div(wp);
  };

  simulateMint = (
    amts: u<Token<Big>>[],
    _blockHeight?: number,
    _inv?: u<Token<BigSource>>[],
  ) => {
    const inv = _inv ?? this.clusterState.inv;
    const blockHeight: number = _blockHeight ?? this.lastBlock;

    const penalty = this.notionalPenalty(
      blockHeight,
      inv,
      vectorPlus(inv, amts) as u<Token<BigSource>>[],
    );

    const notionalValue = vectorDot(amts, this.clusterState.prices).plus(
      penalty,
    );
    const mintSubtotal = big(this.clusterState.outstanding_balance_tokens)
      .mul(notionalValue)
      .div(vectorDot(inv, this.clusterState.prices));

    return mintSubtotal;
  };

  executeMint = (amts: u<Token<Big>>[], _blockHeight?: number) => {
    const blockHeight: number = _blockHeight ?? this.lastBlock;

    const mintAmt = this.simulateMint(amts, blockHeight);

    this.clusterState.outstanding_balance_tokens = big(
      this.clusterState.outstanding_balance_tokens,
    )
      .plus(mintAmt)
      .toFixed() as u<CT>;
    this.clusterState.inv = vectorPlus(this.clusterState.inv, amts).map((amt) =>
      amt.toFixed(),
    ) as u<Token>[];
    this.updateEma(
      blockHeight,
      vectorDot(this.clusterState.inv, this.clusterState.prices),
    );
  };

  notionalPenalty = (
    blockHeight: number,
    currInv: u<Token<BigSource>>[],
    newInv: u<Token<BigSource>>[],
  ) => {
    const imb0 = this.imbalance(currInv);
    const imb1 = this.imbalance(newInv);

    const nav = vectorDot(currInv, this.clusterState.prices);
    const e = min(this.getEma(blockHeight, nav), nav);

    if (imb0.lt(imb1)) {
      const cutoffLo = big(
        this.penaltyInfo.penalty_params.penalty_cutoff_lo,
      ).mul(e);
      const cutoffHi = big(
        this.penaltyInfo.penalty_params.penalty_cutoff_hi,
      ).mul(e);

      if (imb1.gt(cutoffHi)) {
        console.warn(
          'this move causes cluster imbalance too high error but we will ignore',
        );
        console.table({
          imb1: imb1.toFixed(),
          cutoffHi: cutoffHi.toFixed(),
        });
      }

      const penalty1 = big(min(imb1, cutoffLo).minus(min(imb0, cutoffLo))).mul(
        this.penaltyInfo.penalty_params.penalty_amt_lo,
      );

      const imb0Mid = min(max(imb0, cutoffLo), cutoffHi);
      const imb1Mid = min(max(imb1, cutoffLo), cutoffHi);

      const amtGap = big(this.penaltyInfo.penalty_params.penalty_amt_hi).minus(
        this.penaltyInfo.penalty_params.penalty_amt_lo,
      );
      const cutoffGap = big(cutoffHi).minus(cutoffLo);

      const imb0MidHeight = big(
        big(big(imb0Mid.minus(cutoffLo)).mul(amtGap)).div(cutoffGap),
      ).plus(this.penaltyInfo.penalty_params.penalty_amt_lo);
      const imb1MidHeight = big(
        big(big(imb1Mid.minus(cutoffLo)).mul(amtGap)).div(cutoffGap),
      ).plus(this.penaltyInfo.penalty_params.penalty_amt_lo);

      const penalty2 = big(
        big(imb0MidHeight.plus(imb1MidHeight)).mul(imb1Mid.minus(imb0Mid)),
      ).div(2);
      const penalty3 = big(max(imb1, cutoffHi).minus(max(imb0, cutoffHi))).mul(
        this.penaltyInfo.penalty_params.penalty_amt_hi,
      );

      return sum(penalty1, penalty2, penalty3).mul(-1);
    } else {
      const cutoff = big(this.penaltyInfo.penalty_params.reward_cutoff).mul(e);
      return big(max(imb0, cutoff).minus(max(imb1, cutoff))).mul(
        this.penaltyInfo.penalty_params.reward_amt,
      );
    }
  };

  getEma = (blockHeight: number, netAssetValue: BigSource): Big => {
    if (this.lastBlock !== 0) {
      const dt = blockHeight - this.lastBlock;
      const tau = -600;
      const factor = exp(big(dt).div(tau));
      return big(factor.mul(this.penaltyInfo.ema)).plus(
        big(big(1).minus(factor)).mul(netAssetValue),
      );
    } else {
      return big(netAssetValue);
    }
  };

  updateEma = (blockHeight: number, netAssetValue: BigSource) => {
    this.penaltyInfo.ema = this.getEma(
      blockHeight,
      netAssetValue,
    ).toFixed() as Num;
  };
}
