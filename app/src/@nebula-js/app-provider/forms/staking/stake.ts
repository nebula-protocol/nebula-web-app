import {
  useApp,
  useCW20Balance,
  useGasPrice,
  useTax,
  useTerraNativeBalanceQuery,
  useTerraswapPoolQuery,
} from '@libs/app-provider';
import { useForm } from '@libs/use-form';
import {
  NebulaContants,
  NebulaContractAddress,
  stakingStakeForm,
  StakingStakeFormInput,
} from '@nebula-js/app-fns';
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

  const { constants } = useApp<NebulaContractAddress, NebulaContants>();

  const fixedFee = useGasPrice(constants.fixedGas, 'uusd');

  const uUST = useTerraNativeBalanceQuery<UST>(
    'uusd',
    connectedWallet?.walletAddress,
  );

  const tax = useTax<UST>('uusd');

  //const { tax, tokenBalances } = useBank<NebulaTokenBalances, NebulaTax>();

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
