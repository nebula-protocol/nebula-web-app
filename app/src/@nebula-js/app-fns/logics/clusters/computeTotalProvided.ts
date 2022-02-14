import { u, UST } from '@nebula-js/types';
import { sum } from '@libs/big-math';
import { Big } from 'big.js';
import { computeProvided } from './computeProvided';
import { ClustersInfoList } from '@nebula-js/app-fns';

// total provided = sum(provided[])
export function computeTotalProvided(
  clusterInfos: ClustersInfoList,
): u<UST<Big>> {
  return sum(
    ...clusterInfos.map(({ clusterState }) => computeProvided(clusterState)),
  ) as u<UST<Big>>;
}
