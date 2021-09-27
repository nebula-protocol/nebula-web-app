import {
  useCW20Balance,
  useFixedFee,
  useTerraswapPoolQuery,
  useUstBalance,
  useUstTax,
} from '@libs/app-provider';
import { useForm } from '@libs/use-form';
import { stakingStakeForm, StakingStakeFormInput } from '@nebula-js/app-fns';
import { CT, CW20Addr, HumanAddr, Rate, UST } from '@nebula-js/types';
import { useConnectedWallet } from '@terra-money/wallet-provider';

export interface StakingStakeFormParams {
  ustTokenPairAddr: HumanAddr;
  tokenAddr: CW20Addr;
}

export function useStakingStakeForm({
  ustTokenPairAddr,
  tokenAddr,
}: StakingStakeFormParams) {
  const connectedWallet = useConnectedWallet();

  const fixedFee = useFixedFee();

  const uUST = useUstBalance(connectedWallet?.walletAddress);

  const tax = useUstTax();

  const uCT = useCW20Balance<CT>(tokenAddr, connectedWallet?.walletAddress);

  const { data: { terraswapPoolInfo } = {} } =
    useTerraswapPoolQuery<CT>(ustTokenPairAddr);

  return useForm(
    stakingStakeForm,
    {
      tokenBalance: uCT,
      ustBalance: uUST,
      poolInfo: terraswapPoolInfo,
      taxRate: tax.taxRate,
      maxTaxUUSD: tax.maxTax,
      fixedFee,
      connected: !!connectedWallet,
    },
    () =>
      ({
        ustAmount: '' as UST,
        slippageTolerance: '0.01' as Rate,
      } as StakingStakeFormInput),
  );
}
