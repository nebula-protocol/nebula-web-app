import { NativeDenom, Token, u } from '@libs/types';
import { defaultLcdFetch, LCDFetch } from '../../clients/lcd';

export async function terraTreasuryTaxCapQuery<T extends Token>(
  denom: NativeDenom,
  lcdEndpoint: string,
  lcdFetch: LCDFetch = defaultLcdFetch,
  requestInit?: RequestInit,
): Promise<u<T>> {
  return lcdFetch<u<T>>(
    `${lcdEndpoint}/treasury/tax_cap/${denom}`,
    requestInit,
  );
}
