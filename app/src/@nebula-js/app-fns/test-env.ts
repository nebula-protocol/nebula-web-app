import { TEST_CONTRACT_ADDRESS as TERRA_TEST_CONTRACT_ADDRESS } from '@libs/app-fns/test-env';
import { CW20Addr, HumanAddr } from '@libs/types';

export const TEST_CONTRACT_ADDRESS = {
  airdrop:
    'terra1pxvnr6xxmxtgymttpvhp7w8g6hnxmd6gru8eqzlffmljyak8wutsct6dmf' as HumanAddr,
  collector:
    'terra1z5hcdgw7sqkrkmwnvgt57dkg7z9jgpt6ha2j79m2ctv97kgmjjcs2xm423' as HumanAddr,
  community:
    'terra1d03xv30ljdsdprqgtw9vc7n5reaka4f0e6vuzduzuh5xg5jrpy0qu5elmf' as HumanAddr,
  clusterFactory:
    'terra15mx3zrwmhdr8sg0j737s4lrqyhsdsgqdvhcnf9dsklcrf8n8klmq5lwzsh' as HumanAddr,
  gov: 'terra1h30f6k500ze9lac70paadtklrn7hue5azragx4sjl3wujwe4cwrqvw0hsh' as HumanAddr,
  incentives:
    'terra1y4tmwwm7qmuhpjuwx0nmmaw0pptpphnmln5mzpm27enqn2la7p0q95fcpd' as HumanAddr,
  incentivesCustody:
    'terra1atm2slufh0z2tmg4mtkwr9kvsh4tf4zut4ngqt6m96smd5ka0tnqqv7prl' as HumanAddr,
  staking:
    'terra1wgeqalcmkr8ug9m086sv4kcjpshs48enfkawepthjsw9k883098qqjhefp' as HumanAddr,
  oracle:
    'terra14029wvjzhtkphqyjykzjg0tjpgqmt0nw2vkcls9s46umgxjmmxssyxdkxx' as HumanAddr,
  oracleHub:
    'terra1umxshy9lymmseygh2f4ymztehqltl2cmvwdy7zlwuz6u4uvhehjsyf9arf' as HumanAddr,
  terraswap: {
    factory: TERRA_TEST_CONTRACT_ADDRESS.terraswap.factory,
    nebUstPair:
      'terra15xk25aeexx3ssk4ufentfje3qqau96sjkvncvqllhv5adqsk7yyq3et8v4' as HumanAddr,
  },
  cw20: {
    NEB: 'terra1d6gepuu0ykszjayvzzfddg2fqsqyjemdrg9xrahewgknawxfusmq5e0n0h' as CW20Addr,
    aUST: '' as CW20Addr,
  },
  anchor: {
    proxy: '' as HumanAddr,
    market: '' as HumanAddr,
  },
};

export * from '@libs/app-fns/test-env';
