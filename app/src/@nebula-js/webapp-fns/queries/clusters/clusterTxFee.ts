import { u, UST } from '@nebula-js/types';
import { PersistCache } from '@packages/persist-cache';
import big, { Big } from 'big.js';
import { ClusterFee } from '../../types';

const gasPriceCache = new PersistCache<{ uusd: u<UST> }>(
  '__nebula_gas_prices__',
);

export async function clusterTxFeeQuery(
  gasPriceEndpoint: string,
  clusterFee: ClusterFee,
  assetLength: number,
  requestInit?: RequestInit,
): Promise<u<UST<Big>>> {
  const { uusd } = gasPriceCache.has(gasPriceEndpoint)
    ? gasPriceCache.get(gasPriceEndpoint)!
    : await fetch(gasPriceEndpoint, requestInit).then<{ uusd: u<UST> }>((res) =>
        res.json(),
      );

  return big(big(clusterFee.base).mul(uusd)).plus(
    big(assetLength).mul(big(clusterFee.perAsset).mul(uusd)),
  ) as u<UST<Big>>;
}
