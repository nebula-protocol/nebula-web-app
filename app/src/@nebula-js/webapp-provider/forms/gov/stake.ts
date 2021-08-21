import { NEB } from '@nebula-js/types';
import {
  govStakeForm,
  GovStakeFormInput,
  NebulaTax,
  NebulaTokenBalances,
} from '@nebula-js/webapp-fns';
import { useGovStakerQuery } from '@nebula-js/webapp-provider/queries/gov/staker';
import { useForm } from '@packages/use-form';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useBank } from '@packages/webapp-provider';
import { useMemo } from 'react';
import { useNebulaWebapp } from '../../contexts/webapp';

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
