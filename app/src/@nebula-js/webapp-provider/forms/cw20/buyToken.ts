import { CT, CW20Addr, HumanAddr, UST } from '@nebula-js/types';
import {
  cw20BuyTokenForm,
  CW20BuyTokenFormInput,
  NebulaTax,
  NebulaTokenBalances,
} from '@nebula-js/webapp-fns';
import { useForm } from '@terra-dev/use-form';
import { useBank, useTerraWebapp } from '@terra-money/webapp-provider';
import { useNebulaWebapp } from '../../contexts/webapp';

export interface CW20BuyTokenFormParams {
  ustCtPairAddr: HumanAddr;
  ctAddr: CW20Addr;
}

export function useCW20BuyTokenForm({
  ustCtPairAddr,
  ctAddr,
}: CW20BuyTokenFormParams) {
  const { mantleFetch, mantleEndpoint } = useTerraWebapp();

  const {
    constants: { fixedGas },
  } = useNebulaWebapp();

  const { tax, tokenBalances } = useBank<NebulaTokenBalances, NebulaTax>();

  return useForm(
    cw20BuyTokenForm,
    {
      ustCtPairAddr,
      ctAddr,
      mantleEndpoint,
      mantleFetch,
      ustBalance: tokenBalances.uUST,
      tax,
      fixedGas,
    },
    () => ({ ustAmount: '' as UST } as CW20BuyTokenFormInput<CT>),
  );
}
