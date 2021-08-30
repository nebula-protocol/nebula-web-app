import { CW20Addr, HumanAddr } from '@libs/types';

export interface NebulaContractAddress {
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
