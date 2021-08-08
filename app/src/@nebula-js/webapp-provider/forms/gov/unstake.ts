import { NEB } from '@nebula-js/types';
import {
  govUnstakeForm,
  GovUnstakeFormInput,
  NebulaTax,
  NebulaTokenBalances,
} from '@nebula-js/webapp-fns';
import { useForm } from '@terra-dev/use-form';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useBank } from '@terra-money/webapp-provider';
import { useNebulaWebapp } from '../../contexts/webapp';
import { useGovStakerQuery } from '../../queries/gov/staker';

export function useGovUnstakeForm() {
  const connectedWallet = useConnectedWallet();

  const {
    constants: { fixedGas },
  } = useNebulaWebapp();

  const { tokenBalances } = useBank<NebulaTokenBalances, NebulaTax>();

  const { data: { govStaker } = {} } = useGovStakerQuery(
    connectedWallet?.walletAddress,
  );

  return useForm(
    govUnstakeForm,
    {
      nebBalance: tokenBalances.uNEB,
      ustBalance: tokenBalances.uUST,
      govStaker,
      fixedGas,
      connected: !!connectedWallet,
    },
    () => ({ nebAmount: '' as NEB } as GovUnstakeFormInput),
  );
}
