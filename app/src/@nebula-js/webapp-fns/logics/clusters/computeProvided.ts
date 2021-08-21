import { cluster, u, UST } from '@nebula-js/types';
import { sum, vectorMultiply } from '@packages/big-math';
import { Big } from 'big.js';

export function computeProvided(
  clusterState: cluster.ClusterStateResponse,
): u<UST<Big>> {
  return sum(
    ...vectorMultiply(
      clusterState.target.map(({ amount }) => amount),
      vectorMultiply(clusterState.prices, clusterState.inv),
    ),
  ) as u<UST<Big>>;
}
