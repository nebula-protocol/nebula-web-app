import {
  ContractAddress,
  CW20Addr,
  HumanAddr,
  Rate,
  u,
  UST,
} from '@nebula-js/types';
import { NebulaContants } from './types';

export const DEFAULT_CONTRACT_ADDRESS: Record<string, ContractAddress> = {
  testnet: {
    airdrop: 'terra1g5eszxwklzzzv3ufrue76srg2tmzwen82c2nh6' as HumanAddr,
    collector: 'terra1agyrm7ze5fcmdukup9fxcphuvd953r83w0tag3' as HumanAddr,
    community: 'terra1wctesqppju3skwmka3wccjc3zmwyjqymv6swex' as HumanAddr,
    clusterFactory: 'terra1whnjz0mpjxryx78l4uvfj8k39qagt590vkyart' as HumanAddr,
    gov: 'terra1zedwd4g9852vczdlygg7jcmwwym6wjkrv6fah0' as HumanAddr,
    incentives: 'terra18xc566yxz8gpsu3l2m86357as7xznzhx4smp6a' as HumanAddr,
    incentivesCustody:
      'terra1d20xy0mrxdxstmrmr2fxh4ff0s02d78ycucqek' as HumanAddr,
    staking: 'terra146wk9rrcj9ntmk9sclwcnys5u6yqzm5m8398gd' as HumanAddr,
    terraswap: {
      factory: 'terra18qpjm4zkvqnpjpw0zn0tdr8gdzvt8au35v45xf' as HumanAddr,
      nebUstPair: 'terra12srjhpfn4guesgeft4th2vp3zj9e7uagym0w27' as HumanAddr,
    },
    cw20: {
      NEB: 'terra1z2qnu7hdxzfr0yx9nepxyhdyjvsw508yfukzrj' as CW20Addr,
    },
  },
};

export const DEFAULT_CONSTANTS: Record<string, NebulaContants> = {
  mainnet: {
    gasFee: 1_000_000 as u<UST<number>>,
    fixedGas: 250_000 as u<UST<number>>,
    blocksPerYear: 4_656_810,
    gasAdjustment: 1.6 as Rate<number>,
  },
  testnet: {
    gasFee: 6_000_000 as u<UST<number>>,
    fixedGas: 3_500_000 as u<UST<number>>,
    blocksPerYear: 4_656_810,
    gasAdjustment: 1.4 as Rate<number>,
  },
};
