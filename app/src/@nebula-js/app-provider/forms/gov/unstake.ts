import { useLunaBalance } from '@libs/app-provider';
import { useForm } from '@libs/use-form';
import { govUnstakeForm, GovUnstakeFormInput } from '@nebula-js/app-fns';
import { useGovFee } from '@nebula-js/app-provider';
import { useNebBalance } from '@nebula-js/app-provider/hooks/useNebBalance';
import { NEB } from '@nebula-js/types';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useGovStakerQuery } from '../../queries/gov/staker';

export function useGovUnstakeForm() {
  const connectedWallet = useConnectedWallet();

  const fixedFee = useGovFee();

  const uUST = useLunaBalance(connectedWallet?.walletAddress);

  const uNEB = useNebBalance(connectedWallet?.walletAddress);

  const { data: { govStaker } = {} } = useGovStakerQuery(
    connectedWallet?.walletAddress,
  );

  return useForm(
    govUnstakeForm,
    {
      nebBalance: uNEB,
      lunaBalance: uUST,
      govStaker,
      fixedFee,
      connected: !!connectedWallet,
    },
    () => ({ nebAmount: '' as NEB } as GovUnstakeFormInput),
  );
}
