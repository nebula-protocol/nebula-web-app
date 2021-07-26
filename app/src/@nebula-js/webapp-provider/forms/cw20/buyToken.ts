import { CW20Addr, HumanAddr, Token, UST } from '@nebula-js/types';
import {
  CW20BuyTokenForm,
  cw20BuyTokenForm,
  CW20BuyTokenFormInput,
  NebulaTax,
  NebulaTokenBalances,
} from '@nebula-js/webapp-fns';
import { useForm } from '@terra-dev/use-form';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useBank, useTerraWebapp } from '@terra-money/webapp-provider';
import { useNebulaWebapp } from '../../contexts/webapp';

export interface CW20BuyTokenFormParams {
  ustCtPairAddr: HumanAddr;
  ctAddr: CW20Addr;
}

export function useCW20BuyTokenForm<T extends Token>({
  ustCtPairAddr,
  ctAddr,
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
      ustCtPairAddr,
      ctAddr,
      mantleEndpoint,
      mantleFetch,
      ustBalance: tokenBalances.uUST,
      tax,
      fixedGas,
      maxSpread: 0.1,
      connected: !!connectedWallet,
    },
    () => ({ ustAmount: '' as UST } as CW20BuyTokenFormInput<T>),
  );
}
