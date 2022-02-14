import { cluster, CT, terraswap, u, UST } from '@nebula-js/types';
import big, { Big } from 'big.js';
import { computeCTPrices } from './computeCTPrices';

// marketcap in pool (not cluster!!)
// marketcap = totalsupply of CT in cluster * price in pool
export function computeMarketCap(
  clusterState: cluster.ClusterStateResponse,
  terraswapPool: terraswap.pair.PoolResponse<CT, UST>,
): u<UST<Big>> {
  const poolPrice = computeCTPrices(clusterState, terraswapPool).poolPrice;

  return big(clusterState.outstanding_balance_tokens).mul(poolPrice) as u<
    UST<Big>
  >;
}
