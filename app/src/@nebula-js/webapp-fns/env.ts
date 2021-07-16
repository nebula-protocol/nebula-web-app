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
    airdrop: 'terra1ysuwgm6p6p5pe5y6yqva3jeaur9un5j9maw4v3' as HumanAddr,
    collector: 'terra134x00e7qrap7eqlvaf3mqs96fcjk7stzqjkuad' as HumanAddr,
    community: 'terra1w207dpeysx6hdrqqkv68qeel67xxaldyge7x4j' as HumanAddr,
    clusterFactory: 'terra1c88eegv4dsw0r3g05d8la6p6y2vg8gghkmhjlj' as HumanAddr,
    gov: 'terra1ccep3m8ph7vpr93k2l8cnc376qxd25e5ullsv6' as HumanAddr,
    incentives: 'terra1ww447wps8k26u44vljlvnqgx53w7sqa3us5pne' as HumanAddr,
    incentivesCustody:
      'terra1q90nlhfh9qmvgv6tlg33kd8ywz0crex09ghayh' as HumanAddr,
    staking: 'terra1ghwfq5jpu8lajazjhqsddd5tcx6ep6s75p2fjt' as HumanAddr,
    terraswap: {
      factory: 'terra18qpjm4zkvqnpjpw0zn0tdr8gdzvt8au35v45xf' as HumanAddr,
      nebUstPair: 'terra17p5hushhk2jllfv9yhp55jrlz6ta7gt6ek7y3u' as HumanAddr,
    },
    cw20: {
      NEB: 'terra1uquyhhpkju0359xryyh0c6rsgwplpcvr4shu9r' as CW20Addr,
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
