import { cluster, u, UST } from '@nebula-js/types';
import { vectorDot } from '@libs/big-math';
import { Big } from 'big.js';

// provided = net asset value = marketcap in cluster
// provided = dot(inv, prices)
export function computeProvided(
  clusterState: cluster.ClusterStateResponse,
): u<UST<Big>> {
  return vectorDot(clusterState.inv, clusterState.prices) as u<UST<Big>>;
}
