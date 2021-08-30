import { useForm } from '@libs/use-form';
import { useBank } from '@libs/webapp-provider';
import { NEB } from '@nebula-js/types';
import {
  govStakeForm,
  GovStakeFormInput,
  NebulaTax,
  NebulaTokenBalances,
} from '@nebula-js/webapp-fns';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useMemo } from 'react';
import { useNebulaWebapp } from '../../contexts/webapp';
import { useGovStakerQuery } from '../../queries/gov/staker';

export function useGovStakeForm() {
  const connectedWallet = useConnectedWallet();

  const {
    constants: { fixedGas },
  } = useNebulaWebapp();

  const { tokenBalances } = useBank<NebulaTokenBalances, NebulaTax>();

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
      nebBalance: tokenBalances.uNEB,
      ustBalance: tokenBalances.uUST,
      fixedGas,
      minLockForWeeks: lockEndWeeks ?? 0,
      connected: !!connectedWallet,
      govStaker,
    },
    () => ({ nebAmount: '' as NEB, lockForWeeks: 0 } as GovStakeFormInput),
  );
}
