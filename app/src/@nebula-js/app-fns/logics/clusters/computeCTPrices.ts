import { cluster, CT, terraswap, Rate, UST } from '@nebula-js/types';
import { getAssetAmount, computeProvided } from '@nebula-js/app-fns';
import { divWithDefault } from '@libs/big-math';
import { Big } from 'big.js';

export type ClusterTokenPrices = {
  poolPrice: UST<Big>;
  clusterPrice: UST<Big>;
  premium: Rate<Big>;
};

// poolPrice = ustAmount / ctAmount
// clusterPrice = provided / ctTotalSupply
// premium = (poolPrice - clusterPrice) / cluster
export function computeCTPrices(
  clusterState: cluster.ClusterStateResponse,
  terraswapPool: terraswap.pair.PoolResponse<CT, UST>,
): ClusterTokenPrices {
  const ctAmount = getAssetAmount<CT>(terraswapPool.assets, {
    token: { contract_addr: clusterState.cluster_token },
  });

  const ustAmount = getAssetAmount<UST>(terraswapPool.assets, 'uusd');

  const provided = computeProvided(clusterState);

  const poolPrice = divWithDefault(ustAmount, ctAmount, 0) as UST<Big>;

  const clusterPrice = divWithDefault(
    provided,
    clusterState.outstanding_balance_tokens,
    0,
  ) as UST<Big>;

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
