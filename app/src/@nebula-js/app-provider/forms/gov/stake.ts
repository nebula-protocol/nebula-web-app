import { useFixedFee, useUstBalance } from '@libs/app-provider';
import { useForm } from '@libs/use-form';
import { govStakeForm, GovStakeFormInput } from '@nebula-js/app-fns';
import { NEB } from '@nebula-js/types';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useMemo } from 'react';
import { useNebBalance } from '../../hooks/useNebBalance';
import { useGovStakerQuery } from '../../queries/gov/staker';

export function useGovStakeForm() {
  const connectedWallet = useConnectedWallet();

  const fixedFee = useFixedFee();

  const uUST = useUstBalance(connectedWallet?.walletAddress);

  const uNEB = useNebBalance(connectedWallet?.walletAddress);

  const { data: { govStaker } = {} } = useGovStakerQuery(
    connectedWallet?.walletAddress,
  );

  const lockEndWeeks = useMemo(() => {
    return govStaker?.lock_end_week
      ? govStaker.lock_end_week -
          Math.floor(Date.now() / (1000 * 60 * 60 * 24 * 7))
      : undefined;
  }, [govStaker?.lock_end_week]);

  return useForm(
    govStakeForm,
    {
      nebBalance: uNEB,
      ustBalance: uUST,
      fixedFee,
      minLockForWeeks: lockEndWeeks ?? 1,
      connected: !!connectedWallet,
      govStaker,
    },
    () => ({ nebAmount: '' as NEB, lockForWeeks: 1 } as GovStakeFormInput),
  );
}
