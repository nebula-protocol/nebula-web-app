import {
  useCW20Balance,
  useFixedFee,
  useTerraswapPoolQuery,
  useLunaBalance,
  useUstTax,
} from '@libs/app-provider';
import { useForm } from '@libs/use-form';
import { stakingStakeForm, StakingStakeFormInput } from '@nebula-js/app-fns';
import { CT, CW20Addr, HumanAddr, Rate, Luna } from '@nebula-js/types';
import { useConnectedWallet } from '@terra-money/wallet-provider';

export interface StakingStakeFormParams {
  lunaTokenPairAddr: HumanAddr;
  tokenAddr: CW20Addr;
}

export function useStakingStakeForm({
  lunaTokenPairAddr,
  tokenAddr,
}: StakingStakeFormParams) {
  const connectedWallet = useConnectedWallet();

  const fixedFee = useFixedFee();

  const uUST = useLunaBalance(connectedWallet?.walletAddress);

  const tax = useUstTax();

  const uCT = useCW20Balance<CT>(tokenAddr, connectedWallet?.walletAddress);

  const { data: { terraswapPoolInfo } = {} } =
    useTerraswapPoolQuery<CT>(lunaTokenPairAddr);

  return useForm(
    stakingStakeForm,
    {
      tokenBalance: uCT,
      lunaBalance: uUST,
      poolInfo: terraswapPoolInfo,
      taxRate: tax.taxRate,
      maxTaxUUSD: tax.maxTax,
      fixedFee,
      connected: !!connectedWallet,
    },
    () =>
      ({
        lunaAmount: '' as Luna,
        slippageTolerance: '0.01' as Rate,
      } as StakingStakeFormInput),
  );
}
