import { cluster, CT, terraswap, u, UST } from '@nebula-js/types';
import big, { Big } from 'big.js';

export function computeMarketCap(
  clusterState: cluster.ClusterStateResponse,
  terraswapPool: terraswap.pair.PoolResponse<CT, UST>,
): u<UST<Big>> {
  const ustIndex = terraswapPool.assets.findIndex(
    (asset) => 'native_token' in asset.info,
  );
  const ust = terraswapPool.assets[ustIndex].amount as u<UST>;
  const token = terraswapPool.assets[ustIndex === 0 ? 1 : 0].amount as u<CT>;

  return big(clusterState.outstanding_balance_tokens).mul(
    big(ust).div(token),
  ) as u<UST<Big>>;
}
