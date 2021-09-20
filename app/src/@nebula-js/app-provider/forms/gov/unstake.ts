import {
  useApp,
  useCW20Balance,
  useGasPrice,
  useTerraNativeBalanceQuery,
} from '@libs/app-provider';
import { useForm } from '@libs/use-form';
import {
  govUnstakeForm,
  GovUnstakeFormInput,
  NebulaContants,
  NebulaContractAddress,
} from '@nebula-js/app-fns';
import { NEB, UST } from '@nebula-js/types';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useGovStakerQuery } from '../../queries/gov/staker';

export function useGovUnstakeForm() {
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

  return useForm(
    govUnstakeForm,
    {
      nebBalance: uNEB,
      ustBalance: uUST,
      govStaker,
      fixedGas: fixedFee,
      connected: !!connectedWallet,
    },
    () => ({ nebAmount: '' as NEB } as GovUnstakeFormInput),
  );
}
