import { useFixedFee, useUstBalance } from '@libs/app-provider';
import { useForm } from '@libs/use-form';
import { govUnstakeForm, GovUnstakeFormInput } from '@nebula-js/app-fns';
import { useNebBalance } from '@nebula-js/app-provider/hooks/useNebBalance';
import { NEB } from '@nebula-js/types';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useGovStakerQuery } from '../../queries/gov/staker';

export function useGovUnstakeForm() {
  const connectedWallet = useConnectedWallet();

  const fixedFee = useFixedFee();

  const uUST = useUstBalance(connectedWallet?.walletAddress);

  const uNEB = useNebBalance(connectedWallet?.walletAddress);

  const { data: { govStaker } = {} } = useGovStakerQuery(
    connectedWallet?.walletAddress,
  );

  return useForm(
    govUnstakeForm,
    {
      nebBalance: uNEB,
      ustBalance: uUST,
      govStaker,
      fixedFee,
      connected: !!connectedWallet,
    },
    () => ({ nebAmount: '' as NEB } as GovUnstakeFormInput),
  );
}
