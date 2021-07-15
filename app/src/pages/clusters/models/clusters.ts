import { CT, Rate, u, UST } from '@nebula-js/types';
import { partitionColor } from '@nebula-js/ui';
import {
  AssetTokenIndex,
  ClustersInfoList,
  getAssetAmount,
} from '@nebula-js/webapp-fns';
import { sum, vectorMultiply } from '@terra-dev/big-math';
import big, { Big } from 'big.js';

export interface ClustersListItem {
  index: number;
  id: string;
  name: string;
  nameLowerCase: string;
  price: u<UST<Big>>;
  hr24: Rate<Big>;
  hr24diff: Rate<Big>;
  totalProvided: u<UST<Big>>;
  premium: Rate<Big>;
  marketCap: u<UST<Big>>;
  volume: u<UST<Big>>;
  assets: { label: string; value: number; color: string }[];
}

export function toClustersListItems(
  infoList: ClustersInfoList,
  assetTokens: AssetTokenIndex,
): ClustersListItem[] {
  return infoList.map(
    ({ clusterState, clusterConfig, terraswapPair, terraswapPool }, i) => {
      const ctAmount = getAssetAmount<u<CT>>(terraswapPool.assets, {
        token: { contract_addr: clusterState.cluster_token },
      });

      const ustAmount = getAssetAmount<u<UST>>(terraswapPool.assets, 'uusd');

      if (big(ctAmount).eq(0) || big(ustAmount).eq(0)) {
        return {
          index: i,
          id: clusterState.cluster_contract_address,
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
            label: assetTokens.getSymbol(asset) ?? '-',
            value: 10,
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
        index: i,
        id: clusterState.cluster_contract_address,
        name: clusterConfig.config.name,
        nameLowerCase: clusterConfig.config.name.toLowerCase(),
        price,
        hr24: big(999) as Rate<Big>,
        hr24diff: big(0.00999) as Rate<Big>,
        marketCap,
        totalProvided,
        premium,
        volume: big(111) as u<UST<Big>>,
        assets: clusterState.assets.map((asset, j) => ({
          label: assetTokens.getSymbol(asset) ?? '-',
          value: big(big(clusterState.inv[j]).mul(clusterState.prices[j]))
            .div(invPricesSum)
            .toNumber(),
          color: partitionColor[j % partitionColor.length],
        })),
      };
    },
  );
}
