import { useTerraTreasuryTaxCapQuery } from '@libs/app-provider/queries/terra/treasuryTaxCap';
import { useTerraTreasuryTaxRateQuery } from '@libs/app-provider/queries/terra/treasuryTaxRate';
import { NativeDenom, Rate, Token, u } from '@libs/types';

export function useTax<T extends Token>(
  denom: NativeDenom,
): { taxRate: Rate; maxTax: u<T> } {
  const { data: maxTax = '0' as u<T> } = useTerraTreasuryTaxCapQuery<T>(denom);

  const { data: taxRate = '1' as Rate } = useTerraTreasuryTaxRateQuery();

  return {
    maxTax,
    taxRate,
  };
}
