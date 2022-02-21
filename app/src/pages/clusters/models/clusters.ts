import {
  ClusterInfo,
  computeCTPrices,
  computeMarketCap,
  computeProvided,
  ClusterTokenPrices,
} from '@nebula-js/app-fns';
import { cw20, CT, HumanAddr, Rate, Token, u, UST } from '@nebula-js/types';
import { AssetView, toAssetView } from './assets';
import big, { Big } from 'big.js';

export interface ClusterView {
  addr: HumanAddr;
  tokenInfo: cw20.TokenInfoResponse<Token>;
  name: string;
  nameLowerCase: string;
  description: string;
  prices: ClusterTokenPrices;
  hr24: Rate<Big>;
  hr24diff: Rate<Big>;
  provided: u<UST<Big>>;
  marketCap: u<UST<Big>>;
  volume: u<UST<Big>>;
  assets: AssetView[];
  totalSupply: u<CT>;
  isActive: boolean;
}

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
    totalSupply: clusterState.outstanding_balance_tokens,
    isActive: clusterState.active,
  };
}
