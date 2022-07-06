import {
  useFixedFee,
  useTerraswapPoolQuery,
  useLunaBalance,
  useUstTax,
} from '@libs/app-provider';
import { useForm } from '@libs/use-form';
import {
  StakingUnstakeForm,
  stakingUnstakeForm,
  StakingUnstakeFormInput,
} from '@nebula-js/app-fns';
import { CW20Addr, HumanAddr, LP, Token, u } from '@nebula-js/types';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useStakingRewardInfoQuery } from '../../queries/staking/rewardInfo';

export interface CW20WithdrawTokenFormParams {
  lunaTokenPairAddr: HumanAddr;
  tokenAddr: CW20Addr;
}

export function useStakingUnstakeForm<T extends Token>({
  lunaTokenPairAddr,
  tokenAddr,
}: CW20WithdrawTokenFormParams) {
  const connectedWallet = useConnectedWallet();

  const { taxRate, maxTax } = useUstTax();

  const fixedFee = useFixedFee();

  const uUST = useLunaBalance(connectedWallet?.walletAddress);

  const { data: { rewardInfo } = {} } = useStakingRewardInfoQuery(tokenAddr);

  const { data: { terraswapPoolInfo } = {} } =
    useTerraswapPoolQuery<T>(lunaTokenPairAddr);

  const form: StakingUnstakeForm<T> = stakingUnstakeForm;

  return useForm(
    form,
    {
      lpBalance: rewardInfo?.reward_infos[0]?.bond_amount ?? ('0' as u<LP>),
      lunaBalance: uUST,
      poolInfo: terraswapPoolInfo,
      taxRate,
      maxTaxUUSD: maxTax,
      fixedFee,
      connected: !!connectedWallet,
    },
    () => ({ lpAmount: '' as LP } as StakingUnstakeFormInput),
  );
}
