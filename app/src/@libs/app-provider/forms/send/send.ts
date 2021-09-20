import {
  sendForm,
  SendForm,
  SendFormInput,
  SendTokenInfo,
} from '@libs/app-fns';
import { useApp } from '@libs/app-provider/contexts/app';
import { useGasPrice } from '@libs/app-provider/hooks/useGasPrice';
import { useTerraNativeBalanceQuery } from '@libs/app-provider/queries/terra/nativeBalances';
import { useTax } from '@libs/app-provider/queries/terra/tax';
import { Token, UST } from '@libs/types';
import { useForm } from '@libs/use-form';
import { useConnectedWallet } from '@terra-dev/use-wallet';
import { useSendBalanceQuery } from '../../queries/send/balance';

export interface SendFormParams {
  tokenInfo: SendTokenInfo;
}

export function useSendForm<T extends Token>({ tokenInfo }: SendFormParams) {
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

  const balance = useSendBalanceQuery<T>(
    'native_token' in tokenInfo.assetInfo
      ? tokenInfo.assetInfo.native_token.denom
      : tokenInfo.assetInfo.token.contract_addr,
  );

  const form: SendForm<T> = sendForm;

  return useForm(
    form,
    {
      tokenInfo,
      balance,
      walletAddr: connectedWallet?.walletAddress,
      mantleEndpoint,
      mantleFetch,
      ustBalance: uUST,
      taxRate,
      maxTaxUUSD: maxTax,
      fixedGas: fixedFee,
      maxSpread: 0.1,
      connected: !!connectedWallet,
    },
    () => ({ amount: '', toAddr: '', memo: '' } as SendFormInput<T>),
  );
}
