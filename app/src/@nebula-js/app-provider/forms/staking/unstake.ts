import {
  useApp,
  useGasPrice,
  useTax,
  useTerraNativeBalanceQuery,
  useTerraswapPoolQuery,
} from '@libs/app-provider';
import { useForm } from '@libs/use-form';
import {
  NebulaContants,
  NebulaContractAddress,
  StakingUnstakeForm,
  stakingUnstakeForm,
  StakingUnstakeFormInput,
} from '@nebula-js/app-fns';
import { CW20Addr, HumanAddr, LP, Token, u, UST } from '@nebula-js/types';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useStakingRewardInfoQuery } from '../../queries/staking/rewardInfo';

export interface CW20WithdrawTokenFormParams {
  ustTokenPairAddr: HumanAddr;
  tokenAddr: CW20Addr;
}

export function useStakingUnstakeForm<T extends Token>({
  ustTokenPairAddr,
  tokenAddr,
}: CW20WithdrawTokenFormParams) {
  const connectedWallet = useConnectedWallet();

  const { constants } = useApp<NebulaContractAddress, NebulaContants>();

  const { taxRate, maxTax } = useTax('uusd');

  const fixedFee = useGasPrice(constants.fixedGas, 'uusd');

  const uUST = useTerraNativeBalanceQuery<UST>('uusd');

  const { data: { rewardInfo } = {} } = useStakingRewardInfoQuery(tokenAddr);

  const { data: { terraswapPoolInfo } = {} } =
    useTerraswapPoolQuery<T>(ustTokenPairAddr);

  const form: StakingUnstakeForm<T> = stakingUnstakeForm;

  return useForm(
    form,
    {
      lpBalance: rewardInfo?.reward_infos[0]?.bond_amount ?? ('0' as u<LP>),
      ustBalance: uUST,
      poolInfo: terraswapPoolInfo,
      taxRate,
      maxTaxUUSD: maxTax,
      fixedFee,
      connected: !!connectedWallet,
    },
    () => ({ lpAmount: '' as LP } as StakingUnstakeFormInput),
  );
}
