import { NEB } from '@nebula-js/types';
import {
  govStakeForm,
  GovStakeFormInput,
  NebulaTax,
  NebulaTokenBalances,
} from '@nebula-js/webapp-fns';
import { useForm } from '@terra-dev/use-form';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useBank } from '@terra-money/webapp-provider';
import { useNebulaWebapp } from '../../contexts/webapp';

export function useGovStakeForm() {
  const connectedWallet = useConnectedWallet();

  const {
    constants: { fixedGas },
  } = useNebulaWebapp();

  const { tokenBalances } = useBank<NebulaTokenBalances, NebulaTax>();

  return useForm(
    govStakeForm,
    {
      nebBalance: tokenBalances.uNEB,
      ustBalance: tokenBalances.uUST,
      fixedGas,
      connected: !!connectedWallet,
    },
    () => ({ nebAmount: '' as NEB, lockForWeeks: 52 } as GovStakeFormInput),
  );
}
