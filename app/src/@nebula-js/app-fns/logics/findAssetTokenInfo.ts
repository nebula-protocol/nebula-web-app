import { cw20, terraswap, Token } from '@nebula-js/types';
import { AssetTokenInfo } from '../queries/clusters/info';

export function findAssetTokenInfo(
  asset: terraswap.AssetInfo,
  tokenInfos: AssetTokenInfo[],
): cw20.TokenInfoResponse<Token> | undefined {
  return tokenInfos.find(({ asset: tokenAsset }) => {
    if (
      'token' in asset &&
      'token' in tokenAsset &&
      asset.token.contract_addr === tokenAsset.token.contract_addr
    ) {
      return true;
    } else if (
      'native_token' in asset &&
      'native_token' in tokenAsset &&
      asset.native_token.denom === tokenAsset.native_token.denom
    ) {
      return true;
    }
    return false;
  })?.tokenInfo;
}
