import { cw20, Token, u } from '@nebula-js/types';
import { PersistCache } from '@terra-dev/persist-cache';

export const cw20TokenInfoCache = new PersistCache<
  cw20.TokenInfoResponse<u<Token>>
>('__nebula_token_info__');
