import {
  ClusterInfo,
  computeCTPrices,
  computeMarketCap,
  computeProvided,
  computeLiquidity,
} from '@nebula-js/app-fns';
import { Rate, u, UST } from '@nebula-js/types';
import { toAssetView } from './assets';
import { ClusterView } from './types';
import big, { Big } from 'big.js';

export function toClusterView({
  clusterState,
  clusterConfig,
  terraswapPool,
  assetTokenInfos,
  clusterTokenInfo,
}: ClusterInfo): ClusterView {
  const prices = computeCTPrices(clusterState, terraswapPool);

  const marketCap = computeMarketCap(clusterState, terraswapPool);

  const provided = computeProvided(clusterState);

  const liquidity = computeLiquidity(terraswapPool);

  return {
    addr: clusterState.cluster_contract_address,
    tokenInfo: clusterTokenInfo,
    name: clusterConfig.config.name,
    nameLowerCase: clusterConfig.config.name.toLowerCase(),
    description: clusterConfig.config.description,
    prices,
    // TODO indexer data
    hr24: big(999) as Rate<Big>,
    // TODO indexer data
    hr24diff: big(0.00999) as Rate<Big>,
    marketCap,
    provided,
    // TODO indexer data
    volume: big(111) as u<UST<Big>>,
    assets: toAssetView(clusterState, assetTokenInfos),
    liquidity,
    totalSupply: clusterState.outstanding_balance_tokens,
    isActive: clusterState.active,
  };
}
