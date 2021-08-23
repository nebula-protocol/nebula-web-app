import { Token } from '@nebula-js/types';
import {
  NebulaTax,
  NebulaTokenBalances,
  sendForm,
  SendForm,
  SendFormInput,
  SendTokenInfo,
} from '@nebula-js/webapp-fns';
import { useForm } from '@libs/use-form';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useBank, useTerraWebapp } from '@libs/webapp-provider';
import { useNebulaWebapp } from '../../contexts/webapp';
import { useSendBalanceQuery } from '../../queries/send/balance';

export interface SendFormParams {
  tokenInfo: SendTokenInfo;
}

export function useSendForm<T extends Token>({ tokenInfo }: SendFormParams) {
  const connectedWallet = useConnectedWallet();

  const { mantleFetch, mantleEndpoint } = useTerraWebapp();

  const balance = useSendBalanceQuery<T>(
    'native_token' in tokenInfo.assetInfo
      ? tokenInfo.assetInfo.native_token.denom
      : tokenInfo.assetInfo.token.contract_addr,
  );

  const {
    constants: { fixedGas },
  } = useNebulaWebapp();

  const { tax, tokenBalances } = useBank<NebulaTokenBalances, NebulaTax>();

  const form: SendForm<T> = sendForm;

  return useForm(
    form,
    {
      tokenInfo,
      balance,
      walletAddr: connectedWallet?.walletAddress,
      mantleEndpoint,
      mantleFetch,
      ustBalance: tokenBalances.uUST,
      tax,
      fixedGas,
      maxSpread: 0.1,
      connected: !!connectedWallet,
    },
    () => ({ amount: '', toAddr: '', memo: '' } as SendFormInput<T>),
  );
}
