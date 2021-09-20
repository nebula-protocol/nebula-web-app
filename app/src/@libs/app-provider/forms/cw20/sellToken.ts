import {
  CW20SellTokenForm,
  cw20SellTokenForm,
  CW20SellTokenFormInput,
} from '@libs/app-fns';
import { CW20Addr, HumanAddr, Token, UST } from '@libs/types';
import { useForm } from '@libs/use-form';
import { useConnectedWallet } from '@terra-dev/use-wallet';
import { useApp } from '../../contexts/app';
import { useGasPrice } from '../../hooks/useGasPrice';
import { useCW20Balance } from '../../queries/cw20/balance';
import { useTerraNativeBalanceQuery } from '../../queries/terra/nativeBalances';
import { useTax } from '../../queries/terra/tax';

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
