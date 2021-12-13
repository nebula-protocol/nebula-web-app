import { TerraswapPool } from '@libs/app-fns';
import { CW20Addr, NEB, Rate, u, UST } from '@nebula-js/types';
import { DistributionSchedule, StakingPoolInfoList } from '@nebula-js/app-fns';
import big, { Big } from 'big.js';

export type StakingView = Array<{
  index: number;
  id: CW20Addr;
  symbol: string;
  name: string;
  nameLowerCase: string;
  apr: Rate;
  totalStaked: u<UST<Big>>;
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
            terraswapPair,
          },
          i,
        ) => {
          const now = new Date();

          const weightSum =
            distributionSchedule.distributionInfo.weights.reduce((p, v) => [
              'sum' as CW20Addr,
              p[1] + v[1],
            ])[1];
          const liquidityValue = big(
            big(nebPool.terraswapPoolInfo.tokenPrice).mul(
              terraswapPoolInfo.tokenPoolSize,
            ),
          ).plus(terraswapPoolInfo.ustPoolSize) as u<UST<Big>>;

          const totalStaked = liquidityValue.mul(
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
          let apr = '0' as Rate;
          if (now < distributionSchedule.endTime && index > -1) {
            const weight = distributionSchedule.distributionInfo.weights.find(
              (w) => w[0] === tokenAddr,
            );
            const computedWeight = weight ? weight[1] : 0;
            const aps =
              (distributionSchedule.distribution[index].distributePerSec *
                Number(nebPool.terraswapPoolInfo.tokenPrice) *
                (computedWeight / weightSum)) /
              Number(poolInfo.total_bond_amount);
            apr = (
              aps === Infinity
                ? '0'
                : (aps * 60 * 60 * 24 * 365).toFixed(2).toString()
            ) as Rate;
          }

          return {
            index: i,
            id: tokenAddr,
            symbol: tokenInfo.symbol,
            name: `${tokenInfo.symbol}-UST LP`,
            nameLowerCase: `${tokenInfo.symbol}-UST LP`.toLowerCase(),
            apr,
            totalStaked,
          };
        },
      )
    : [];
}
