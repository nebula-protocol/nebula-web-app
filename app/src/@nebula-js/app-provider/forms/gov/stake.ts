import {
  useApp,
  useCW20Balance,
  useGasPrice,
  useTerraNativeBalanceQuery,
} from '@libs/app-provider';
import { useForm } from '@libs/use-form';
import {
  govStakeForm,
  GovStakeFormInput,
  NebulaContants,
  NebulaContractAddress,
} from '@nebula-js/app-fns';
import { NEB, UST } from '@nebula-js/types';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useMemo } from 'react';
import { useGovStakerQuery } from '../../queries/gov/staker';

export function useGovStakeForm() {
  const connectedWallet = useConnectedWallet();

  const { contractAddress, constants } = useApp<
    NebulaContractAddress,
    NebulaContants
  >();

  const fixedFee = useGasPrice(constants.fixedGas, 'uusd');

  const uUST = useTerraNativeBalanceQuery<UST>(
    'uusd',
    connectedWallet?.walletAddress,
  );

  const uNEB = useCW20Balance<NEB>(
    contractAddress.cw20.NEB,
    connectedWallet?.walletAddress,
  );

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
      minLockForWeeks: lockEndWeeks ?? 0,
      connected: !!connectedWallet,
      govStaker,
    },
    () => ({ nebAmount: '' as NEB, lockForWeeks: 0 } as GovStakeFormInput),
  );
}
