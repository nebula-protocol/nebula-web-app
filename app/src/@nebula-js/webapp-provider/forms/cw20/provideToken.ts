import { CW20Addr, HumanAddr, Token, u, UST } from '@nebula-js/types';
import {
  cw20ProvideTokenForm,
  CW20ProvideTokenForm,
  CW20ProvideTokenFormInput,
  NebulaTax,
  NebulaTokenBalances,
} from '@nebula-js/webapp-fns';
import { useForm } from '@terra-dev/use-form';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useBank } from '@terra-money/webapp-provider';
import { useNebulaWebapp } from '../../contexts/webapp';
import { useCW20BalanceQuery } from '../../queries/cw20/balance';
import { useTerraswapPoolQuery } from '../../queries/terraswap/pool';

export interface CW20ProvideTokenFormParams {
  ustTokenPairAddr: HumanAddr;
  tokenAddr: CW20Addr;
}

export function useCW20ProvideTokenForm<T extends Token>({
  ustTokenPairAddr,
  tokenAddr,
}: CW20ProvideTokenFormParams) {
  const connectedWallet = useConnectedWallet();

  const {
    constants: { fixedGas },
  } = useNebulaWebapp();

  const { tax, tokenBalances } = useBank<NebulaTokenBalances, NebulaTax>();

  const { data: { tokenBalance } = {} } = useCW20BalanceQuery<T>(
    tokenAddr,
    connectedWallet?.walletAddress,
  );

  const { data: { terraswapPoolInfo } = {} } =
    useTerraswapPoolQuery<T>(ustTokenPairAddr);

  const form: CW20ProvideTokenForm<T> = cw20ProvideTokenForm;

  return useForm(
    form,
    {
      tokenBalance: tokenBalance?.balance ?? ('0' as u<T>),
      ustBalance: tokenBalances.uUST,
      poolInfo: terraswapPoolInfo,
      tax,
      fixedGas,
      connected: !!connectedWallet,
    },
    () => ({ ustAmount: '' as UST } as CW20ProvideTokenFormInput<T>),
  );
}
