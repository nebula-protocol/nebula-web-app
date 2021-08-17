import { cluster, HumanAddr, penalty, rs, terraswap, Token, u } from '@nebula-js/types';
import { vectorDot, vectorMultiply } from '@terra-dev/big-math';

// https://github.com/nebula-protocol/nebula-contracts/blob/develop/deploy-scripts/simulation_cluster_ops.py
export class ClusterSimulatorWithPenalty {
  readonly clusterState!: cluster.ClusterStateResponse;
  readonly penaltyInfo!: penalty.ParamsResponse;
  readonly targetAssets!: terraswap.AssetInfo[];
  readonly targetAmounts!: u<Token>[];
  
  constructor(private clusterAddr: HumanAddr) {
  }
  
  // reset_initial_state()
  init = async () => {
    // query cluster_state
    // query penalty params
  }
  
  imbalance = (inv: u<Token<rs.Uint128>>[]) => {
    const wp = vectorDot(this.targetAmounts, this.clusterState.prices);
    const u = vectorMultiply(this.targetAmounts, this.clusterState.prices);
    
    const ip = vectorDot(inv, this.clusterState.prices);
    const v = vectorMultiply(inv, this.clusterState.prices);
  }
}