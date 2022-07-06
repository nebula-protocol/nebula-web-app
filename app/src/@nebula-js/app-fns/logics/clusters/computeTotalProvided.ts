import { u, Luna } from '@nebula-js/types';
import { sum } from '@libs/big-math';
import { Big } from 'big.js';
import { computeProvided } from './computeProvided';
import { ClustersInfoList } from '@nebula-js/app-fns';

// total provided = sum(provided[])
export function computeTotalProvided(
  clusterInfos: ClustersInfoList,
): u<Luna<Big>> {
  return sum(
    ...clusterInfos.map(({ clusterState }) => computeProvided(clusterState)),
  ) as u<Luna<Big>>;
}
