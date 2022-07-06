import { AppConstants, AppContractAddress } from '@libs/app-provider';
import { CW20Addr, HumanAddr, Gas } from '@libs/types';
import { NebulaClusterFee } from '@nebula-js/app-fns';

export interface NebulaContractAddress extends AppContractAddress {
  airdrop: HumanAddr;
  clusterFactory: HumanAddr;
  collector: HumanAddr;
  community: HumanAddr;
  gov: HumanAddr;
  incentives: HumanAddr;
  incentivesCustody: HumanAddr;
  staking: HumanAddr;
  oracle: HumanAddr;
  oracleHub: HumanAddr;

  terraswap: {
    factory: HumanAddr;
    nebUstPair: HumanAddr;
  };

  cw20: {
    NEB: CW20Addr;
    aUST: CW20Addr;
  };

  anchor: {
    proxy: HumanAddr;
    market: HumanAddr;
  };
}

export interface NebulaContants extends AppConstants {
  swapGasWantedPerAsset: Gas;
  govGas: Gas;
  airdropGasWanted: Gas;
  airdropGas: Gas;
  nebula: {
    clusterFee: NebulaClusterFee;
  };
}
