import { CW20Addr, HumanAddr, LP, Token, u } from '@nebula-js/types';
import {
  NebulaTax,
  NebulaTokenBalances,
  StakingUnstakeForm,
  stakingUnstakeForm,
  StakingUnstakeFormInput,
} from '@nebula-js/webapp-fns';
import { useForm } from '@terra-dev/use-form';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useBank } from '@terra-money/webapp-provider';
import { useNebulaWebapp } from '../../contexts/webapp';
import { useStakingRewardInfoQuery } from '../../queries/staking/rewardInfo';
import { useTerraswapPoolQuery } from '../../queries/terraswap/pool';

export interface CW20WithdrawTokenFormParams {
  ustTokenPairAddr: HumanAddr;
  clusterTokenAddr: CW20Addr;
}

export function useStakingUnstakeForm<T extends Token>({
  ustTokenPairAddr,
  clusterTokenAddr,
}: CW20WithdrawTokenFormParams) {
  const connectedWallet = useConnectedWallet();

  const {
    constants: { fixedGas },
  } = useNebulaWebapp();

  const { tax, tokenBalances } = useBank<NebulaTokenBalances, NebulaTax>();

  const { data: { rewardInfo } = {} } =
    useStakingRewardInfoQuery(clusterTokenAddr);

  const { data: { terraswapPoolInfo } = {} } =
    useTerraswapPoolQuery<T>(ustTokenPairAddr);

  const form: StakingUnstakeForm<T> = stakingUnstakeForm;

  return useForm(
    form,
    {
      lpBalance: rewardInfo?.reward_infos[0]?.bond_amount ?? ('0' as u<LP>),
      ustBalance: tokenBalances.uUST,
      poolInfo: terraswapPoolInfo,
      tax,
      fixedGas,
      connected: !!connectedWallet,
    },
    () => ({ lpAmount: '' as LP } as StakingUnstakeFormInput),
  );
}