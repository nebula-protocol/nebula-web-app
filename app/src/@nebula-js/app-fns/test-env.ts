import { TEST_CONTRACT_ADDRESS as TERRA_TEST_CONTRACT_ADDRESS } from '@libs/app-fns/test-env';
import { CW20Addr, HumanAddr } from '@libs/types';

export const TEST_CONTRACT_ADDRESS = {
  airdrop: 'terra1z4zrm0fpuh6dq3fea3xhgf93lr30z98pzksftt' as HumanAddr,
  collector: 'terra14xwh27azy0dkp3yceh4chcaeay5ax260puxfl7' as HumanAddr,
  community: 'terra1fxnzfjgfvr8g6v0nxnwfjmt5vcmt64k5l5cn9y' as HumanAddr,
  clusterFactory: 'terra1zdga7ntu73qzevtk44amefqze05k5gkwu82k05' as HumanAddr,
  gov: 'terra17ry0egj85545rd3lllda4g48z7qrgkt4nu3ym2' as HumanAddr,
  incentives: 'terra180sav47jd7npzc9pepqzmed2m6g3g50v44ndd5' as HumanAddr,
  incentivesCustody:
    'terra16ju95fyez67xxqqlelf3wjz74kankq30z780tx' as HumanAddr,
  staking: 'terra1gt2h9zu6c753h5ufv9a0n8hwlnpwfr2a4wyrc3' as HumanAddr,
  terraswap: {
    factory: TERRA_TEST_CONTRACT_ADDRESS.terraswap.factory,
    nebUstPair: 'terra1wlzgd4qa3w7ua9nhw454u7gfaxjkmlkuf3fk7f' as HumanAddr,
  },
  cw20: {
    NEB: 'terra1c56uwrm8pukfh3q8ul460er7t32mth47gy8kmx' as CW20Addr,
  },
};

export * from '@libs/app-fns/test-env';
