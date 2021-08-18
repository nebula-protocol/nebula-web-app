import {
  cluster,
  HumanAddr,
  penalty,
  terraswap,
  Token,
  u,
} from '@nebula-js/types';
import {
  abs, min,
  sum,
  vectorDot,
  vectorMinus,
  vectorMultiply,
  vectorPlus,
} from '@terra-dev/big-math';
import { Big, BigSource } from 'big.js';

// https://github.com/nebula-protocol/nebula-contracts/blob/develop/deploy-scripts/simulation_cluster_ops.py
export class ClusterSimulatorWithPenalty {
  readonly clusterState!: cluster.ClusterStateResponse;
  readonly penaltyInfo!: penalty.ParamsResponse;
  readonly targetAssets!: terraswap.AssetInfo[];
  readonly targetAmounts!: u<Token>[];
  // TODO initialize
  private lastBlock: number = 0;

  constructor(private clusterAddr: HumanAddr) {}

  resetInitialState = async () => {
    // query cluster_state
    // query penalty params
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

    // TODO
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

    // TODO
  };
  
  getEma = (blockHeight: number, netAssetValue: BigSource) => {
    if (this.lastBlock !== 0) {
      const dt = blockHeight - this.lastBlock;
      const tau = -600;
      //const factor =
    } else {
    
    }
    
    // TODO
  }
}
