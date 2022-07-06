import { useLunaBalance } from '@libs/app-provider';
import { useForm } from '@libs/use-form';
import { govStakeForm, GovStakeFormInput } from '@nebula-js/app-fns';
import { useGovFee } from '@nebula-js/app-provider';
import { NEB } from '@nebula-js/types';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useNebBalance } from '../../hooks/useNebBalance';
import { useGovStakerQuery } from '../../queries/gov/staker';

export function useGovStakeForm() {
  const connectedWallet = useConnectedWallet();

  const fixedFee = useGovFee();

  const uUST = useLunaBalance(connectedWallet?.walletAddress);

  const uNEB = useNebBalance(connectedWallet?.walletAddress);

  const { data: { govStaker } = {} } = useGovStakerQuery(
    connectedWallet?.walletAddress,
  );

  return useForm(
    govStakeForm,
    {
      nebBalance: uNEB,
      lunaBalance: uUST,
      fixedFee,
      connected: !!connectedWallet,
      govStaker,
    },
    () => ({ nebAmount: '' as NEB } as GovStakeFormInput),
  );
}
