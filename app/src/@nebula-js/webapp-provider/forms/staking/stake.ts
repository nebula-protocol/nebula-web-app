import { useForm } from '@libs/use-form';
import { useBank } from '@libs/webapp-provider';
import { CT, CW20Addr, HumanAddr, Rate, u, UST } from '@nebula-js/types';
import {
  NebulaTax,
  NebulaTokenBalances,
  stakingStakeForm,
  StakingStakeFormInput,
} from '@nebula-js/webapp-fns';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useNebulaWebapp } from '../../contexts/webapp';
import { useCW20BalanceQuery } from '../../queries/cw20/balance';
import { useTerraswapPoolQuery } from '../../queries/terraswap/pool';

export interface StakingStakeFormParams {
  ustTokenPairAddr: HumanAddr;
  tokenAddr: CW20Addr;
}

export function useStakingStakeForm({
  ustTokenPairAddr,
  tokenAddr,
}: StakingStakeFormParams) {
  const connectedWallet = useConnectedWallet();

  const {
    constants: { fixedGas },
  } = useNebulaWebapp();

  const { tax, tokenBalances } = useBank<NebulaTokenBalances, NebulaTax>();

  const { data: { tokenBalance } = {} } = useCW20BalanceQuery<CT>(
    tokenAddr,
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
    () =>
      ({
        ustAmount: '' as UST,
        slippageTolerance: '1' as Rate,
      } as StakingStakeFormInput),
  );
}
