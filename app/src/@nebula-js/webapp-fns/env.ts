import {
  ContractAddress,
  CW20Addr,
  HumanAddr,
  Rate,
  u,
  UST,
} from '@nebula-js/types';
import { AssetTokenIndex } from '@nebula-js/webapp-fns/models/assetTokens';
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

const Contract = (addr: string) => addr as CW20Addr;

export const DEFAULT_ASSET_TOKENS: Record<string, AssetTokenIndex> = {
  testnet: new AssetTokenIndex({
    ANC: Contract('terra15tecrcm27fenchxaqde9f8ws8krfgjnqf2hhcv'),
    MIR: Contract('terra1gkjll5uwqlwa8mrmtvzv435732tffpjql494fd'),
    mAAPL: Contract('terra1pwd9etdemugqdt92t5d3g98069z0axpz9plnsk'),
    mABNB: Contract('terra1jm4j6k0e2dpug7z0glc87lwvyqh40z74f40n52'),
    mAMC: Contract('terra1wa87zjty4y983yyt604hdnyr8rm9mwz7let8uz'),
    mAMZN: Contract('terra18mjauk9ug8y29q678c2qlee6rkd9aunrpe9q97'),
    mBABA: Contract('terra1uvzz9fchferxpg64pdshnrc49zkxjcj66uppq8'),
    mBTC: Contract('terra13uya9kcnan6aevfgqxxngfpclqegvht6tfan5p'),
    mCOIN: Contract('terra16e3xu8ly6a622tjykfuwuv80czexece8rz0gs5'),
    mETH: Contract('terra1rxyctpwzqvldalafvry787thslne6asjlwqjhn'),
    mFB: Contract('terra1xl2tf5sjzz9phm4veh5ty5jzqrjykkqw33yt63'),
    mGLXY: Contract('terra17sm265sez3qle769ef4hscx540wem5hvxztpxg'),
    mGME: Contract('terra19y6tdnps3dsd7qc230tk3jplwl9jm27mpcx9af'),
    mGOOGL: Contract('terra1504y0r6pqjn3yep6njukehpqtxn0xdnruye524'),
    mGS: Contract('terra199yfqa5092v2udw0k0h9rau9dzel0jkf5kk3km'),
    mIAU: Contract('terra1n7pd3ssr9sqacwx5hekxsmdy86lwlm0fsdvnwe'),
    mMSFT: Contract('terra18aztjeacdfc5s30ms0558cy8lygvam3s4v69jg'),
    mNFLX: Contract('terra1smu8dc2xpa9rfj525n3a3ttgwnacnjgr59smu7'),
    mQQQ: Contract('terra1r20nvsd08yujq29uukva8fek6g32p848kzlkfc'),
    mSLV: Contract('terra1re6mcpu4hgzs5wc77gffsluqauanhpa8g7nmjc'),
    mSPY: Contract('terra1j3l2ul7s8fkaadwdan67hejt7k5nylmxfkwg0w'),
    mTSLA: Contract('terra1k44gg67rnc6av8sn0602876w8we5lu3jp30yec'),
    mTWTR: Contract('terra1897xd8jqjkfpr5496ur8n896gd8fud3shq3t4q'),
    mUSO: Contract('terra1c3nyehgvukzrt5k9lxzzw64d68el6cejyxjqde'),
    mVIXY: Contract('terra12kt7yf3r7k92dmch97u6cu2fggsewaj3kp0yq9'),
  }),
};
