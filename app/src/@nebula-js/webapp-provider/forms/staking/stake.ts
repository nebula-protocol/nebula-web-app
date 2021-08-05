import { CT, CW20Addr, HumanAddr, u, UST } from '@nebula-js/types';
import {
  NebulaTax,
  NebulaTokenBalances,
  stakingStakeForm,
  StakingStakeFormInput,
} from '@nebula-js/webapp-fns';
import { useForm } from '@terra-dev/use-form';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useBank } from '@terra-money/webapp-provider';
import { useNebulaWebapp } from '../../contexts/webapp';
import { useCW20BalanceQuery } from '../../queries/cw20/balance';
import { useTerraswapPoolQuery } from '../../queries/terraswap/pool';

export interface StakingStakeFormParams {
  ustTokenPairAddr: HumanAddr;
  clusterTokenAddr: CW20Addr;
}

export function useStakingStakeForm({
  ustTokenPairAddr,
  clusterTokenAddr,
}: StakingStakeFormParams) {
  const connectedWallet = useConnectedWallet();

  const {
    constants: { fixedGas },
  } = useNebulaWebapp();

  const { tax, tokenBalances } = useBank<NebulaTokenBalances, NebulaTax>();

  const { data: { tokenBalance } = {} } = useCW20BalanceQuery<CT>(
    clusterTokenAddr,
    connectedWallet?.walletAddress,
  );

  const { data: { terraswapPoolInfo } = {} } =
    useTerraswapPoolQuery<CT>(ustTokenPairAddr);

  return useForm(
    stakingStakeForm,
    {
      tokenBalance: tokenBalance?.balance ?? ('0' as u<CT>),
      ustBalance: tokenBalances.uUST,
      poolInfo: terraswapPoolInfo,
      tax,
      fixedGas,
      connected: !!connectedWallet,
    },
    () => ({ ustAmount: '' as UST } as StakingStakeFormInput),
  );
}
