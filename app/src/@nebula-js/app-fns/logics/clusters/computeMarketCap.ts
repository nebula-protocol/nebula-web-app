import { cluster, CT, terraswap, u, Luna } from '@nebula-js/types';
import big, { Big } from 'big.js';
import { computeCTPrices } from './computeCTPrices';

// marketcap in pool (not cluster!!)
// marketcap = totalsupply of CT in cluster * price in pool
export function computeMarketCap(
  clusterState: cluster.ClusterStateResponse,
  terraswapPool: terraswap.pair.PoolResponse<CT, Luna>,
): u<Luna<Big>> {
  const poolPrice = computeCTPrices(clusterState, terraswapPool).poolPrice;

  return big(clusterState.outstanding_balance_tokens).mul(poolPrice) as u<
    Luna<Big>
  >;
}
