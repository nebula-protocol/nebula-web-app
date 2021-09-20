import { AppConstants, AppContractAddress } from '@libs/app-fns';
import { CW20Addr, Gas, HumanAddr } from '@nebula-js/types';

// gas_price = uusd of https://[tequila-]fcd.terra.dev/v1/txs/gas_prices
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

export interface NebulaContractAddress extends AppContractAddress {
  airdrop: HumanAddr;
  clusterFactory: HumanAddr;
  collector: HumanAddr;
  community: HumanAddr;
  gov: HumanAddr;
  incentives: HumanAddr;
  incentivesCustody: HumanAddr;
  staking: HumanAddr;

  terraswap: {
    factory: HumanAddr;
    nebUstPair: HumanAddr;
  };

  cw20: {
    NEB: CW20Addr;
  };
}

export interface NebulaContants extends AppConstants {
  clusterFee: NebulaClusterFee;
}
