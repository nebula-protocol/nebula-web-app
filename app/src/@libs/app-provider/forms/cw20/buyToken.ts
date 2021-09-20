import {
  CW20BuyTokenForm,
  cw20BuyTokenForm,
  CW20BuyTokenFormInput,
} from '@libs/app-fns';
import { useApp } from '@libs/app-provider/contexts/app';
import { useGasPrice } from '@libs/app-provider/hooks/useGasPrice';
import { useTerraNativeBalanceQuery } from '@libs/app-provider/queries/terra/nativeBalances';
import { useTax } from '@libs/app-provider/queries/terra/tax';
import { CW20Addr, HumanAddr, Rate, Token, UST } from '@libs/types';
import { useForm } from '@libs/use-form';
import { useConnectedWallet } from '@terra-dev/use-wallet';

export interface CW20BuyTokenFormParams {
  ustTokenPairAddr: HumanAddr;
  tokenAddr: CW20Addr;
}

export function useCW20BuyTokenForm<T extends Token>({
  ustTokenPairAddr,
  tokenAddr,
}: CW20BuyTokenFormParams) {
  const connectedWallet = useConnectedWallet();

  const {
    mantleFetch,
    mantleEndpoint,
    constants: { fixedGas },
  } = useApp();

  const fixedFee = useGasPrice(fixedGas, 'uusd');

  const { taxRate, maxTax } = useTax<UST>('uusd');

  const uUST = useTerraNativeBalanceQuery<UST>(
    'uusd',
    connectedWallet?.walletAddress,
  );

  const form: CW20BuyTokenForm<T> = cw20BuyTokenForm;

  return useForm(
    form,
    {
      ustTokenPairAddr,
      tokenAddr,
      mantleEndpoint,
      mantleFetch,
      ustBalance: uUST,
      taxRate,
      maxTaxUUSD: maxTax,
      fixedGas: fixedFee,
      connected: !!connectedWallet,
    },
    () =>
      ({
        ustAmount: '' as UST,
        maxSpread: '0.01' as Rate,
      } as CW20BuyTokenFormInput<T>),
  );
}
