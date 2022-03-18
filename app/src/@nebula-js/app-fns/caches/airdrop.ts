import { PersistCache } from '@libs/persist-cache';

export const airdropCache = new PersistCache<boolean>(
  '__nebula_claimed_airdrop__',
);
