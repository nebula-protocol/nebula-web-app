import { DEFAULT_TERRA_CONTRACT_ADDRESS } from '@libs/app-fns';
import {
  CW20Addr,
  Gas,
  HumanAddr,
  NebulaContractAddress,
  Rate,
} from '@nebula-js/types';
import { NebulaContantsInput } from './types';

export const DEFAULT_NEBULA_CONTRACT_ADDRESS: Record<
  string,
  NebulaContractAddress
> = {
  testnet: {
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
      factory: DEFAULT_TERRA_CONTRACT_ADDRESS['testnet'].terraswap.factory,
      nebUstPair: 'terra1wlzgd4qa3w7ua9nhw454u7gfaxjkmlkuf3fk7f' as HumanAddr,
    },
    cw20: {
      NEB: 'terra1c56uwrm8pukfh3q8ul460er7t32mth47gy8kmx' as CW20Addr,
    },
  },
};

export const DEFAULT_NEBULA_CONSTANTS: Record<string, NebulaContantsInput> = {
  mainnet: {
    gasWanted: 1_000_000 as Gas,
    fixedGas: 1_671_053 as Gas,
    //fixedGas: 635_000 as u<UST<number>>,
    blocksPerYear: 4_656_810,
    gasAdjustment: 1.6 as Rate<number>,
    clusterFee: {
      default: {
        txFeeBase: 2_000_000 as Gas,
        txFeePerInventory: 600_000 as Gas,
        txFeePerAsset: 400_000 as Gas,
        gasWantedBase: 1_000_000 as Gas,
        gasWantedPerInventory: 400_000 as Gas,
        gasWantedPerAsset: 280_000 as Gas,
      },
      arbMint: {
        txFeeBase: 2_000_000 as Gas,
        txFeePerInventory: 800_000 as Gas,
        txFeePerAsset: 400_000 as Gas,
        gasWantedBase: 1_000_000 as Gas,
        gasWantedPerInventory: 600_000 as Gas,
        gasWantedPerAsset: 280_000 as Gas,
      },
      //base: 12_700_000 as Gas,
      //perAsset: 762_000 as Gas,
      //gasLimitPerAsset: 10_000 as Gas,
    },
  },
  testnet: {
    gasWanted: 1_000_000 as Gas,
    fixedGas: 1_671_053 as Gas,
    //fixedGas: 635_000 as u<UST<number>>,
    blocksPerYear: 4_656_810,
    gasAdjustment: 1.6 as Rate<number>,
    clusterFee: {
      default: {
        txFeeBase: 2_000_000 as Gas,
        txFeePerInventory: 600_000 as Gas,
        txFeePerAsset: 400_000 as Gas,
        gasWantedBase: 1_000_000 as Gas,
        gasWantedPerInventory: 400_000 as Gas,
        gasWantedPerAsset: 280_000 as Gas,
      },
      arbMint: {
        txFeeBase: 2_000_000 as Gas,
        txFeePerInventory: 800_000 as Gas,
        txFeePerAsset: 400_000 as Gas,
        gasWantedBase: 1_000_000 as Gas,
        gasWantedPerInventory: 600_000 as Gas,
        gasWantedPerAsset: 280_000 as Gas,
      },
      //base: 12_700_000 as Gas,
      //perAsset: 1_100_000 as Gas,
      //gasLimitPerAsset: 600_000 as Gas,
    },
  },
};
