import { useForm } from '@libs/use-form';
import { useBank, useTerraWebapp } from '@libs/webapp-provider';
import { CW20Addr, HumanAddr, Rate, Token, UST } from '@nebula-js/types';
import {
  CW20BuyTokenForm,
  cw20BuyTokenForm,
  CW20BuyTokenFormInput,
  NebulaTax,
  NebulaTokenBalances,
} from '@nebula-js/webapp-fns';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useNebulaWebapp } from '../../contexts/webapp';

export interface CW20BuyTokenFormParams {
  ustTokenPairAddr: HumanAddr;
  tokenAddr: CW20Addr;
}

export function useCW20BuyTokenForm<T extends Token>({
  ustTokenPairAddr,
  tokenAddr,
}: CW20BuyTokenFormParams) {
  const connectedWallet = useConnectedWallet();

  const { mantleFetch, mantleEndpoint } = useTerraWebapp();

  const {
    constants: { fixedGas },
  } = useNebulaWebapp();

  const { tax, tokenBalances } = useBank<NebulaTokenBalances, NebulaTax>();

  const form: CW20BuyTokenForm<T> = cw20BuyTokenForm;

  return useForm(
    form,
    {
      ustTokenPairAddr,
      tokenAddr,
      mantleEndpoint,
      mantleFetch,
      ustBalance: tokenBalances.uUST,
      tax,
      fixedGas,
      connected: !!connectedWallet,
    },
    () =>
      ({
        ustAmount: '' as UST,
        maxSpread: '1' as Rate,
      } as CW20BuyTokenFormInput<T>),
  );
}
