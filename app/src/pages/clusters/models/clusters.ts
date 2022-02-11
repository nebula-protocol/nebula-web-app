import { sum, divWithDefault, vectorMultiply } from '@libs/big-math';
import { ClusterInfo, getAssetAmount } from '@nebula-js/app-fns';
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
import big, { Big } from 'big.js';

export interface AssetView {
  asset: terraswap.Asset<Token>;
  oraclePrice: UST<Big>;
  token: cw20.TokenInfoResponse<Token>;
  amount: u<Token<string>>;
  targetRatio: number;
  portfolioRatio: number;
  color: string;
}

export interface ClusterView {
  addr: HumanAddr;
  tokenInfo: cw20.TokenInfoResponse<Token>;
  name: string;
  nameLowerCase: string;
  description: string;
  price: UST<Big>;
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
  const ctAmount = getAssetAmount<CT>(terraswapPool.assets, {
    token: { contract_addr: clusterState.cluster_token },
  });

  const ustAmount = getAssetAmount<UST>(terraswapPool.assets, 'uusd');

  const targetSum = sum(...clusterState.target.map(({ amount }) => amount));

  const invSum = sum(...clusterState.inv);

  if (big(ctAmount).eq(0) || big(ustAmount).eq(0)) {
    return {
      addr: clusterState.cluster_contract_address,
      tokenInfo: clusterTokenInfo,
      name: clusterConfig.config.name,
      nameLowerCase: clusterConfig.config.name.toLowerCase(),
      description: clusterConfig.config.description,
      price: big(0) as UST<Big>,
      hr24: big(0) as Rate<Big>,
      hr24diff: big(0) as Rate<Big>,
      marketCap: big(0) as u<UST<Big>>,
      totalProvided: big(0) as u<UST<Big>>,
      premium: big(0) as Rate<Big>,
      volume: big(0) as u<UST<Big>>,
      assets: clusterState.target.map((asset, j) => ({
        asset,
        oraclePrice: big(0) as UST<Big>,
        token: assetTokenInfos[j].tokenInfo,
        amount: clusterState.inv[j],
        targetRatio: divWithDefault(asset.amount, targetSum, 0).toNumber(),
        portfolioRatio: divWithDefault(
          clusterState.inv[j],
          invSum,
          0,
        ).toNumber(),
        color: partitionColor[j % partitionColor.length],
      })),
    };
  }

  const price = big(ustAmount).div(ctAmount) as UST<Big>;

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

  return {
    addr: clusterState.cluster_contract_address,
    tokenInfo: clusterTokenInfo,
    name: clusterConfig.config.name,
    nameLowerCase: clusterConfig.config.name.toLowerCase(),
    description: clusterConfig.config.description,
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
    assets: clusterState.target.map((asset, j) => ({
      asset,
      oraclePrice: big(clusterState.prices[j]) as UST<Big>,
      token: assetTokenInfos[j].tokenInfo,
      amount: clusterState.inv[j],
      targetRatio: divWithDefault(asset.amount, targetSum, 0).toNumber(),
      portfolioRatio: divWithDefault(clusterState.inv[j], invSum, 0).toNumber(),
      color: partitionColor[j % partitionColor.length],
    })),
  };
}
