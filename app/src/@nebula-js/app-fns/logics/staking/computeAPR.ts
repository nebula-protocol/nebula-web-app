import { TerraswapPool, TerraswapPoolInfo } from '@libs/app-fns';
import { computeStakedValue } from './computeStakedValue';
import { divWithDefault } from '@libs/big-math';
import { DistributionSchedule } from '@nebula-js/app-fns';
import { CW20Addr, Rate, NEB, Token, staking } from '@nebula-js/types';
import big from 'big.js';

export function computeAPR(
  nebPool: TerraswapPool<NEB>,
  distributionSchedule: DistributionSchedule,
  tokenAddr: CW20Addr,
  terraswapPoolInfo: TerraswapPoolInfo<Token>,
  poolInfo: staking.PoolInfoResponse,
): Rate {
  const now = new Date();
  let apr = '0' as Rate;
  let index = -1;

  const stakedLiquidityValue = computeStakedValue(terraswapPoolInfo, poolInfo);

  for (const schedule of distributionSchedule.distribution) {
    if (schedule.startTime > now) {
      break;
    }
    index++;
  }

  const weightSum = distributionSchedule.distributionInfo.weights.reduce(
    (acc, cur) => (acc = acc + cur[1]),
    0,
  );

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

  return apr;
}
