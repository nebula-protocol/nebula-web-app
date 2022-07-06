import { cluster, CT, terraswap, Rate, Luna } from '@nebula-js/types';
import { getAssetAmount, computeProvided } from '@nebula-js/app-fns';
import { divWithDefault } from '@libs/big-math';
import { Big } from 'big.js';

export type ClusterTokenPrices = {
  poolPrice: Luna<Big>;
  clusterPrice: Luna<Big>;
  premium: Rate<Big>;
};

// poolPrice = lunaAmount / ctAmount
// clusterPrice = provided / ctTotalSupply
// premium = (poolPrice - clusterPrice) / cluster
export function computeCTPrices(
  clusterState: cluster.ClusterStateResponse,
  terraswapPool: terraswap.pair.PoolResponse<CT, Luna>,
): ClusterTokenPrices {
  const ctAmount = getAssetAmount<CT>(terraswapPool.assets, {
    token: { contract_addr: clusterState.cluster_token },
  });

  const lunaAmount = getAssetAmount<Luna>(terraswapPool.assets, 'uluna');

  const provided = computeProvided(clusterState);

  const poolPrice = divWithDefault(lunaAmount, ctAmount, 0) as Luna<Big>;

  const clusterPrice = divWithDefault(
    provided,
    clusterState.outstanding_balance_tokens,
    0,
  ) as Luna<Big>;

  return {
    poolPrice,
    clusterPrice,
    premium: divWithDefault(
      poolPrice.minus(clusterPrice),
      clusterPrice,
      0,
    ) as Rate<Big>,
  };
}
