import { NativeDenom, terraswap, Token, u } from '@nebula-js/types';

export function getAssetAmount<T extends Token>(
  assets: [terraswap.Asset<Token>, terraswap.Asset<Token>],
  assetInfo: terraswap.AssetInfo | 'uluna' | 'uluna',
): u<T> {
  const _assetInfo: terraswap.AssetInfo =
    typeof assetInfo === 'string'
      ? { native_token: { denom: assetInfo as NativeDenom } }
      : assetInfo;

  if ('token' in _assetInfo) {
    return assets.find(
      ({ info }) =>
        'token' in info &&
        info.token.contract_addr === _assetInfo.token.contract_addr,
    )?.amount as u<T>;
  } else if ('native_token' in _assetInfo) {
    return assets.find(
      ({ info }) =>
        'native_token' in info &&
        info.native_token.denom === _assetInfo.native_token.denom,
    )?.amount as u<T>;
  }

  throw new Error(`Can't find matched asset from "${JSON.stringify(assets)}"`);
}
