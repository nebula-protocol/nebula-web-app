import { CT, CW20Addr, HumanAddr, u } from '@nebula-js/types';
import {
  cw20SellTokenForm,
  CW20SellTokenFormInput,
  NebulaTax,
  NebulaTokenBalances,
} from '@nebula-js/webapp-fns';
import { useForm } from '@terra-dev/use-form';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useBank, useTerraWebapp } from '@terra-money/webapp-provider';
import { useNebulaWebapp } from '../../contexts/webapp';
import { useCW20BalanceQuery } from '../../queries/cw20/balance';

export interface CW20SellTokenFormParams {
  ustCtPairAddr: HumanAddr;
  ctAddr: CW20Addr;
}

export function useCW20SellTokenForm({
  ustCtPairAddr,
  ctAddr,
}: CW20SellTokenFormParams) {
  const connectedWallet = useConnectedWallet();

  const { mantleFetch, mantleEndpoint } = useTerraWebapp();

  const {
    constants: { fixedGas },
  } = useNebulaWebapp();

  const { tax } = useBank<NebulaTokenBalances, NebulaTax>();

  const { data: { tokenBalance } = {} } = useCW20BalanceQuery<CT>(
    ctAddr,
    connectedWallet?.terraAddress,
  );

  return useForm(
    cw20SellTokenForm,
    {
      ustCtPairAddr,
      ctAddr,
      mantleEndpoint,
      mantleFetch,
      tokenBalance: tokenBalance?.balance ?? ('0' as u<CT>),
      tax,
      fixedGas,
    },
    () => ({ tokenAmount: '' as CT } as CW20SellTokenFormInput<CT>),
  );
}
