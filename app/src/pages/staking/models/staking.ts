import { TerraswapPool } from '@libs/app-fns';
import { CW20Addr, NEB, Rate, u, Luna } from '@nebula-js/types';
import { DistributionSchedule, StakingPoolInfoList } from '@nebula-js/app-fns';
import { computeStakedValue, computeAPR } from '@nebula-js/app-fns';

export type StakingView = Array<{
  index: number;
  id: CW20Addr;
  symbol: string;
  name: string;
  nameLowerCase: string;
  apr: Rate;
  totalStaked: u<Luna>;
  isActive: boolean;
}>;

export function toStakingView(
  nebPool: TerraswapPool<NEB> | undefined,
  poolInfoList: StakingPoolInfoList,
  distributionSchedule: DistributionSchedule | undefined,
): StakingView {
  // TODO: use useStakingAPR
  return nebPool && distributionSchedule
    ? poolInfoList.map(
        (
          { poolInfo, terraswapPoolInfo, tokenInfo, tokenAddr, isActive },
          i,
        ) => {
          const stakedLiquidityValue = computeStakedValue(
            terraswapPoolInfo,
            poolInfo,
          );

          const apr = computeAPR(
            nebPool,
            distributionSchedule,
            tokenAddr,
            terraswapPoolInfo,
            poolInfo,
          );

          return {
            index: i,
            id: tokenAddr,
            symbol: tokenInfo.symbol,
            name: `${tokenInfo.symbol}-Luna LP`,
            nameLowerCase: `${tokenInfo.symbol}-Luna LP`.toLowerCase(),
            apr,
            totalStaked: stakedLiquidityValue,
            isActive,
          };
        },
      )
    : [];
}
