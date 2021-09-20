import { Rate } from '@libs/types';
import { defaultLcdFetch, LCDFetch } from '../../clients/lcd';

export async function terraTreasuryTaxRateQuery(
  lcdEndpoint: string,
  lcdFetch: LCDFetch = defaultLcdFetch,
  requestInit?: RequestInit,
): Promise<Rate> {
  return lcdFetch<Rate>(`${lcdEndpoint}/treasury/tax_rate`, requestInit);
}
