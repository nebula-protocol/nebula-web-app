import { NEB } from '@nebula-js/types';
import {
  govUnstakeForm,
  GovUnstakeFormInput,
  NebulaTax,
  NebulaTokenBalances,
} from '@nebula-js/webapp-fns';
import { useForm } from '@libs/use-form';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useBank } from '@libs/app-provider';
import { useNebulaWebapp } from '../../contexts/webapp';
import { useGovStakerQuery } from '../../queries/gov/staker';

export function useGovUnstakeForm() {
  const connectedWallet = useConnectedWallet();

  const {
    constants: { fixedFee },
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
      fixedGas: fixedFee,
      connected: !!connectedWallet,
    },
    () => ({ nebAmount: '' as NEB } as GovUnstakeFormInput),
  );
}
