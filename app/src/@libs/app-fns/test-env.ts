import {
  defaultHiveFetcher,
  defaultLcdFetcher,
  HiveQueryClient,
  LcdQueryClient,
} from '@libs/query-client';
import { HumanAddr } from '@libs/types';

export const TEST_HIVE_CLIENT: HiveQueryClient = {
  hiveEndpoint: 'https://pisco-hive.terra.dev/graphql',
  hiveFetcher: defaultHiveFetcher,
};

export const TEST_LCD_CLIENT: LcdQueryClient = {
  lcdEndpoint: 'https://pisco-lcd.terra.dev',
  lcdFetcher: defaultLcdFetcher,
};

export const TEST_WALLET_ADDRESS =
  'terra12hnhh5vtyg5juqnzm43970nh4fw42pt27nw9g9' as HumanAddr;

export const TEST_CONTRACT_ADDRESS = {
  terraswap: {
    factory:
      'terra1z3y69xas85r7egusa0c7m5sam0yk97gsztqmh8f2cc6rr4s4anysudp7k0' as HumanAddr,
  },
};
