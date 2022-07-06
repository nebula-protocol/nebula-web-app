import {
  CW20BuyTokenForm,
  cw20BuyTokenForm,
  CW20BuyTokenFormInput,
} from '@libs/app-fns';
import { CW20Addr, HumanAddr, Rate, Token, Luna } from '@libs/types';
import { useForm } from '@libs/use-form';
import { useConnectedWallet } from '@terra-money/use-wallet';
import { useApp } from '../../contexts/app';
import { useFixedFee } from '../../hooks/useFixedFee';
import { useLunaBalance } from '../../queries/terra/nativeBalances';
import { useUstTax } from '../../queries/terra/tax';

export interface CW20BuyTokenFormParams {
  lunaTokenPairAddr: HumanAddr;
  tokenAddr: CW20Addr;
}

export function useCW20BuyTokenForm<T extends Token>({
  lunaTokenPairAddr,
  tokenAddr,
}: CW20BuyTokenFormParams) {
  const connectedWallet = useConnectedWallet();

  const { queryClient } = useApp();

  const fixedFee = useFixedFee();

  const { taxRate, maxTax } = useUstTax();

  const uUST = useLunaBalance(connectedWallet?.walletAddress);

  const form: CW20BuyTokenForm<T> = cw20BuyTokenForm;

  return useForm(
    form,
    {
      lunaTokenPairAddr,
      tokenAddr,
      queryClient,
      lunaBalance: uUST,
      taxRate,
      maxTaxUUSD: maxTax,
      fixedFee,
      connected: !!connectedWallet,
    },
    () =>
      ({
        lunaAmount: '' as Luna,
        maxSpread: '0.01' as Rate,
      } as CW20BuyTokenFormInput<T>),
  );
}
