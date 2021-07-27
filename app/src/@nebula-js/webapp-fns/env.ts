import {
  ContractAddress,
  CW20Addr,
  HumanAddr,
  Rate,
  u,
  UST,
} from '@nebula-js/types';
import { NebulaContants } from './types';

// TODO legacy contracts
//export const DEFAULT_CONTRACT_ADDRESS: Record<string, ContractAddress> = {
//  testnet: {
//    airdrop: 'terra13ltrqg45wn2tzcesu6exvlyuhvv7tsfx50p22g' as HumanAddr,
//    collector: 'terra1dsl76gx7j476nlfyurx6hac97ptay0srpu5u24' as HumanAddr,
//    community: 'terra1kvgehdwlfj96h46tgwjahvacla90gj29h004nf' as HumanAddr,
//    clusterFactory: 'terra1hvlzmm4ggg938nka46a77e2fyyspg8slrcdntc' as HumanAddr,
//    gov: 'terra1gd4qlxrz7em2s77hjxqpyvyq5fkg3e6u34scqr' as HumanAddr,
//    incentives: 'terra1afqqeqq2jw6hs6sr46tj8u9q7vd0uz6hmtlxck' as HumanAddr,
//    incentivesCustody:
//      'terra19pjtjcdng5el694erm2mrk833r3xc9ady4rflr' as HumanAddr,
//    staking: 'terra1av7s7h7xxzzc3tl8up63flr76yz8lxcsqq4hma' as HumanAddr,
//    terraswap: {
//      factory: 'terra18qpjm4zkvqnpjpw0zn0tdr8gdzvt8au35v45xf' as HumanAddr,
//      nebUstPair: 'terra1pxh7nmp5c3hdp4fnz4wdmar6mlx4f48lma75qs' as HumanAddr,
//    },
//    cw20: {
//      NEB: 'terra1jnqsg0nmn7efavrudreasghq2x4ja5d8wpqjzw' as CW20Addr,
//    },
//  },
//};
export const DEFAULT_CONTRACT_ADDRESS: Record<string, ContractAddress> = {
  testnet: {
    airdrop: 'terra1f6mg20qnt638qq69f2tvw4nk7mlu470y56s2zn' as HumanAddr,
    collector: 'terra1zpjmxrk5lyz43ae5ltpahmmp8grtzm74ljfyxv' as HumanAddr,
    community: 'terra1qd5rlq6653vzetgr6xhm0uc4v6jad6wmqzwq6n' as HumanAddr,
    clusterFactory: 'terra18n5ayre7mwwewaltct5ntux7vg0yacer7elx44' as HumanAddr,
    gov: 'terra1ykg9llugs7drrt3qkelz0q8vjj2d4ph93xsysg' as HumanAddr,
    incentives: 'terra13kd0tkue7dlcz0wf7fmkzw6wwwh84jmuzxyjvh' as HumanAddr,
    incentivesCustody:
      'terra18k8jtzphryx3ghh95mxq904n63c78404wfhsfw' as HumanAddr,
    staking: 'terra1p89np5346pwjxfxrd0euzgnuzvw3lltw8xmwmh' as HumanAddr,
    terraswap: {
      factory: 'terra18qpjm4zkvqnpjpw0zn0tdr8gdzvt8au35v45xf' as HumanAddr,
      nebUstPair: 'terra13eccqfr3stmnlhdj6azxh9ur8nq3qcaj47fpje' as HumanAddr,
    },
    cw20: {
      NEB: 'terra1nrsdypzxrlpz98kumlhecwwama3g72lcszz0fw' as CW20Addr,
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
