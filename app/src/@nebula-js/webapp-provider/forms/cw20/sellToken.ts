import { CW20Addr, HumanAddr, Token, u } from '@nebula-js/types';
import {
  CW20SellTokenForm,
  cw20SellTokenForm,
  CW20SellTokenFormInput,
  NebulaTax,
  NebulaTokenBalances,
} from '@nebula-js/webapp-fns';
import { useForm } from '@packages/use-form';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useBank, useTerraWebapp } from '@packages/webapp-provider';
import { useNebulaWebapp } from '../../contexts/webapp';
import { useCW20BalanceQuery } from '../../queries/cw20/balance';

export interface CW20SellTokenFormParams {
  ustTokenPairAddr: HumanAddr;
  tokenAddr: CW20Addr;
}

export function useCW20SellTokenForm<T extends Token>({
  ustTokenPairAddr,
  tokenAddr,
}: CW20SellTokenFormParams) {
  const connectedWallet = useConnectedWallet();

  const { mantleFetch, mantleEndpoint } = useTerraWebapp();

  const {
    constants: { fixedGas },
  } = useNebulaWebapp();

  const { tax, tokenBalances } = useBank<NebulaTokenBalances, NebulaTax>();

  const { data: { tokenBalance } = {} } = useCW20BalanceQuery<T>(
    tokenAddr,
    connectedWallet?.terraAddress,
  );

  const form: CW20SellTokenForm<T> = cw20SellTokenForm;

  return useForm(
    form,
    {
      ustTokenPairAddr,
      tokenAddr,
      mantleEndpoint,
      mantleFetch,
      ustBalance: tokenBalances.uUST,
      tokenBalance: tokenBalance?.balance ?? ('0' as u<T>),
      tax,
      fixedGas,
      maxSpread: 0.1,
      connected: !!connectedWallet,
    },
    () => ({ tokenAmount: '' as T } as CW20SellTokenFormInput<T>),
  );
}
