import { TerraswapPool } from '@libs/app-fns';
import { CW20Addr, NEB, Rate, u, UST } from '@nebula-js/types';
import { DistributionSchedule, StakingPoolInfoList } from '@nebula-js/app-fns';
import big, { Big } from 'big.js';
import { divWithDefault } from '@libs/big-math';

export type StakingView = Array<{
  index: number;
  id: CW20Addr;
  symbol: string;
  name: string;
  nameLowerCase: string;
  apr: Rate;
  totalStaked: u<UST<Big>>;
  isActive: boolean;
}>;

export function toStakingView(
  nebPool: TerraswapPool<NEB> | undefined,
  poolInfoList: StakingPoolInfoList,
  distributionSchedule: DistributionSchedule | undefined,
): StakingView {
  return nebPool && distributionSchedule
    ? poolInfoList.map(
        (
          {
            poolInfo,
            terraswapPool,
            terraswapPoolInfo,
            tokenInfo,
            tokenAddr,
            isActive,
          },
          i,
        ) => {
          const now = new Date();

          const liquidityValue = big(terraswapPoolInfo.tokenPrice)
            .mul(terraswapPoolInfo.tokenPoolSize)
            .plus(terraswapPoolInfo.ustPoolSize) as u<UST<Big>>;

          const stakedLiquidityValue = liquidityValue.mul(
            big(poolInfo.total_bond_amount).div(
              +terraswapPool.total_share === 0 ? 1 : terraswapPool.total_share,
            ),
          ) as u<UST<Big>>;

          let index = -1;

          for (const schedule of distributionSchedule.distribution) {
            if (schedule.startTime > now) {
              break;
            }
            index++;
          }

          const weightSum =
            distributionSchedule.distributionInfo.weights.reduce(
              (acc, cur) => (acc = acc + cur[1]),
              0,
            );

          let apr = '0' as Rate;
          if (now < distributionSchedule.endTime && index > -1) {
            const weight = distributionSchedule.distributionInfo.weights.find(
              (w) => w[0] === tokenAddr,
            );

            const computedWeight = (weight ? weight[1] : 0) / weightSum;

            const aps = divWithDefault(
              big(distributionSchedule.distribution[index].distributePerSec)
                .mul(computedWeight)
                .mul(nebPool.terraswapPoolInfo.tokenPrice),
              stakedLiquidityValue,
              0,
            );

            apr = aps.mul(60 * 60 * 24 * 365).toFixed(2) as Rate;
          }

          return {
            index: i,
            id: tokenAddr,
            symbol: tokenInfo.symbol,
            name: `${tokenInfo.symbol}-UST LP`,
            nameLowerCase: `${tokenInfo.symbol}-UST LP`.toLowerCase(),
            apr,
            totalStaked: stakedLiquidityValue,
            isActive,
          };
        },
      )
    : [];
}
