import { cw20, Token } from '@nebula-js/types';
import { PersistCache } from '@terra-dev/persist-cache';

export const cw20TokenInfoCache = new PersistCache<
  cw20.TokenInfoResponse<Token>
>('__nebula_token_info__');
