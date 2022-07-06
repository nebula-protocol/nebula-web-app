import { NativeDenom, Rate, Token, u, Luna } from '@libs/types';
// import { useTerraTreasuryTaxCapQuery } from './treasuryTaxCap';
// import { useTerraTreasuryTaxRateQuery } from './treasuryTaxRate';

export function useTax<T extends Token>(
  denom: NativeDenom,
): { taxRate: Rate; maxTax: u<T> } {
  // TODO: remove later
  // const { data: maxTax = '0' as u<T> } = useTerraTreasuryTaxCapQuery<T>(denom);

  // const { data: taxRate = '1' as Rate } = useTerraTreasuryTaxRateQuery();

  return {
    maxTax: '0' as u<T>,
    taxRate: '1' as Rate,
  };
}

export function useUstTax(): { taxRate: Rate; maxTax: u<Luna> } {
  return useTax<Luna>('uluna');
}
