import { useForm } from '@libs/use-form';
import {
  useBank,
  useCW20BalanceQuery,
  useTerraswapPoolQuery,
} from '@libs/webapp-provider';
import { CT, CW20Addr, HumanAddr, Rate, u, UST } from '@nebula-js/types';
import {
  NebulaTax,
  NebulaTokenBalances,
  stakingStakeForm,
  StakingStakeFormInput,
} from '@nebula-js/webapp-fns';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useNebulaWebapp } from '../../contexts/webapp';

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
    constants: { fixedFee },
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
      fixedGas: fixedFee,
      connected: !!connectedWallet,
    },
    () =>
      ({
        ustAmount: '' as UST,
        slippageTolerance: '0.01' as Rate,
      } as StakingStakeFormInput),
  );
}
