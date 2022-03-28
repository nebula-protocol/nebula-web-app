import { u, Token, HumanAddr, Gas, UST, terraswap } from '@nebula-js/types';

// gas_price = uusd of https://[bombay-]fcd.terra.dev/v1/txs/gas_prices
// txFee = (txFeeBase + (inventory * txFeePerInventory) + (asset count * txFeePerAsset)) * gas_price
// gasWanted = gasWantedBase + (inventory * gasWantedPerInventory) + (asset count * gasWantedPerAsset)
export interface ClusterFeeMultipliers {
  txFeeBase: Gas;
  txFeePerInventory: Gas;
  txFeePerAsset: Gas;
  gasWantedBase: Gas;
  gasWantedPerInventory: Gas;
  gasWantedPerAsset: Gas;
}

export interface NebulaClusterFee {
  default: ClusterFeeMultipliers;
  arbMint: ClusterFeeMultipliers;
}

export interface SwapTokenInfo {
  // ust amount to buy token
  buyUustAmount: u<UST>;
  returnAmount: u<Token>;
  tokenUstPairAddr?: HumanAddr;
  beliefPrice: UST;
  info: terraswap.AssetInfo;
}
