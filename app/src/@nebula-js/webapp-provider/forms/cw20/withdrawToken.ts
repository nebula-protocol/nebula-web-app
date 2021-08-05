import { HumanAddr, LP, LPAddr, Token, u } from '@nebula-js/types';
import {
  cw20WithdrawTokenForm,
  CW20WithdrawTokenForm,
  CW20WithdrawTokenFormInput,
  NebulaTax,
  NebulaTokenBalances,
} from '@nebula-js/webapp-fns';
import { useForm } from '@terra-dev/use-form';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useBank } from '@terra-money/webapp-provider';
import { useNebulaWebapp } from '../../contexts/webapp';
import { useCW20BalanceQuery } from '../../queries/cw20/balance';
import { useTerraswapPoolQuery } from '../../queries/terraswap/pool';

export interface CW20WithdrawTokenFormParams {
  ustTokenPairAddr: HumanAddr;
  lpAddr: LPAddr;
}

export function useCW20WithdrawTokenForm<T extends Token>({
  ustTokenPairAddr,
  lpAddr,
}: CW20WithdrawTokenFormParams) {
  const connectedWallet = useConnectedWallet();

  const {
    constants: { fixedGas },
  } = useNebulaWebapp();

  const { tax, tokenBalances } = useBank<NebulaTokenBalances, NebulaTax>();

  const { data: { tokenBalance } = {} } = useCW20BalanceQuery<LP>(
    //@ts-ignore
    lpAddr,
    connectedWallet?.walletAddress,
  );
  //const { data: { tokenBalance } = {} } = useLpBalanceQuery(
  //  lpAddr,
  //  connectedWallet?.walletAddress,
  //);

  console.log(
    'withdrawToken.ts..useCW20WithdrawTokenForm()',
    lpAddr,
    tokenBalance,
  );

  const { data: { terraswapPoolInfo } = {} } =
    useTerraswapPoolQuery<T>(ustTokenPairAddr);

  const form: CW20WithdrawTokenForm<T> = cw20WithdrawTokenForm;

  return useForm(
    form,
    {
      lpBalance: tokenBalance?.balance ?? ('0' as u<LP>),
      ustBalance: tokenBalances.uUST,
      poolInfo: terraswapPoolInfo,
      tax,
      fixedGas,
      connected: !!connectedWallet,
    },
    () => ({ lpAmount: '' as LP } as CW20WithdrawTokenFormInput),
  );
}
