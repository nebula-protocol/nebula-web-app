import { cluster, u, Luna } from '@nebula-js/types';
import { vectorDot } from '@libs/big-math';
import { Big } from 'big.js';

// provided = net asset value = marketcap in cluster
// provided = dot(inv, prices)
export function computeProvided(
  clusterState: cluster.ClusterStateResponse,
): u<Luna<Big>> {
  return vectorDot(clusterState.inv, clusterState.prices) as u<Luna<Big>>;
}
