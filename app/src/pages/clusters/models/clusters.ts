import {
  CT,
  cw20,
  HumanAddr,
  Rate,
  terraswap,
  Token,
  u,
  UST,
} from '@nebula-js/types';
import { partitionColor } from '@nebula-js/ui';
import { ClusterInfo, getAssetAmount } from '@nebula-js/webapp-fns';
import { sum, vectorMultiply } from '@terra-dev/big-math';
import big, { Big } from 'big.js';

export interface AssetView {
  asset: terraswap.AssetInfo;
  token: cw20.TokenInfoResponse<u<Token>>;
  portfolioRatio: number;
  color: string;
}

export interface ClusterView {
  addr: HumanAddr;
  token: cw20.TokenInfoResponse<u<Token>>;
  name: string;
  nameLowerCase: string;
  price: u<UST<Big>>;
  hr24: Rate<Big>;
  hr24diff: Rate<Big>;
  totalProvided: u<UST<Big>>;
  premium: Rate<Big>;
  marketCap: u<UST<Big>>;
  volume: u<UST<Big>>;
  assets: AssetView[];
}

export function toClusterView({
  clusterState,
  clusterConfig,
  terraswapPool,
  assetTokenInfos,
  clusterTokenInfo,
}: ClusterInfo): ClusterView {
  const ctAmount = getAssetAmount<u<CT>>(terraswapPool.assets, {
    token: { contract_addr: clusterState.cluster_token },
  });

  const ustAmount = getAssetAmount<u<UST>>(terraswapPool.assets, 'uusd');

  if (big(ctAmount).eq(0) || big(ustAmount).eq(0)) {
    return {
      addr: clusterState.cluster_contract_address,
      token: clusterTokenInfo,
      name: clusterConfig.config.name,
      nameLowerCase: clusterConfig.config.name.toLowerCase(),
      price: big(0) as u<UST<Big>>,
      hr24: big(0) as Rate<Big>,
      hr24diff: big(0) as Rate<Big>,
      marketCap: big(0) as u<UST<Big>>,
      totalProvided: big(0) as u<UST<Big>>,
      premium: big(0) as Rate<Big>,
      volume: big(0) as u<UST<Big>>,
      assets: clusterState.assets.map((asset, j) => ({
        asset,
        token: assetTokenInfos[j],
        portfolioRatio: 1 / clusterState.assets.length,
        color: partitionColor[j % partitionColor.length],
      })),
    };
  }

  const price = big(ustAmount).div(ctAmount) as u<UST<Big>>;

  const marketCap = big(clusterState.outstanding_balance_tokens).mul(
    price,
  ) as u<UST<Big>>;

  const totalProvided = sum(
    ...vectorMultiply(clusterState.prices, clusterState.inv),
  ) as u<UST<Big>>;

  const premium = (
    totalProvided.eq(0)
      ? big(0)
      : big(big(marketCap).minus(totalProvided)).div(totalProvided)
  ) as Rate<Big>;

  const invPricesSum = sum(
    ...vectorMultiply(clusterState.inv, clusterState.prices),
  );

  return {
    addr: clusterState.cluster_contract_address,
    token: clusterTokenInfo,
    name: clusterConfig.config.name,
    nameLowerCase: clusterConfig.config.name.toLowerCase(),
    price,
    // TODO indexer data
    hr24: big(999) as Rate<Big>,
    // TODO indexer data
    hr24diff: big(0.00999) as Rate<Big>,
    marketCap,
    totalProvided,
    premium,
    // TODO indexer data
    volume: big(111) as u<UST<Big>>,
    assets: clusterState.assets.map((asset, j) => ({
      asset,
      token: assetTokenInfos[j],
      portfolioRatio: big(big(clusterState.inv[j]).mul(clusterState.prices[j]))
        .div(invPricesSum)
        .toNumber(),
      color: partitionColor[j % partitionColor.length],
    })),
  };
}
