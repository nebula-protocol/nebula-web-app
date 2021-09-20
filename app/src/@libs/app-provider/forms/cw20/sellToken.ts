import {
  CW20SellTokenForm,
  cw20SellTokenForm,
  CW20SellTokenFormInput,
} from '@libs/app-fns';
import { useApp } from '@libs/app-provider/contexts/app';
import { useGasPrice } from '@libs/app-provider/hooks/useGasPrice';
import { useTerraNativeBalanceQuery } from '@libs/app-provider/queries/terra/nativeBalances';
import { useTax } from '@libs/app-provider/queries/terra/tax';
import { CW20Addr, HumanAddr, Token, UST } from '@libs/types';
import { useForm } from '@libs/use-form';
import { useConnectedWallet } from '@terra-dev/use-wallet';
import { useCW20Balance } from '../../queries/cw20/balance';

export interface CW20SellTokenFormParams {
  ustTokenPairAddr: HumanAddr;
  tokenAddr: CW20Addr;
}

export function useCW20SellTokenForm<T extends Token>({
  ustTokenPairAddr,
  tokenAddr,
}: CW20SellTokenFormParams) {
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

  const uToken = useCW20Balance<T>(tokenAddr, connectedWallet?.terraAddress);

  const form: CW20SellTokenForm<T> = cw20SellTokenForm;

  return useForm(
    form,
    {
      ustTokenPairAddr,
      tokenAddr,
      mantleEndpoint,
      mantleFetch,
      ustBalance: uUST,
      tokenBalance: uToken,
      taxRate,
      maxTaxUUSD: maxTax,
      fixedGas: fixedFee,
      connected: !!connectedWallet,
    },
    () =>
      ({
        tokenAmount: '' as T,
        maxSpread: '0.01',
      } as CW20SellTokenFormInput<T>),
  );
}
