import { terraswap, Token, u } from '@nebula-js/types';

export function getAssetAmounts<T extends u<Token>, NT extends u<Token>>(
  assets: [terraswap.Asset<T, NT>, terraswap.Asset<T, NT>],
): { token: T; nativeToken: NT } {
  const tokenIndex = assets.findIndex(({ info }) => 'token' in info);

  return {
    token: assets[tokenIndex].amount as T,
    nativeToken: assets[tokenIndex === 0 ? 1 : 0].amount as NT,
  };
}
