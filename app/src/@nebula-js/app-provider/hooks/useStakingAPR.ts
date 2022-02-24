import { useCallback } from 'react';
import { computeAPR } from '@nebula-js/app-fns';
import { staking, CW20Addr, Token, Rate } from '@nebula-js/types';
import { useDistributionScheduleQuery, useNEBPoolQuery } from '..';
import { TerraswapPoolInfo } from '@libs/app-fns';

export function useStakingAPR() {
  const { data: nebPool } = useNEBPoolQuery();
  const { data: distributionSchedule } = useDistributionScheduleQuery();

  return useCallback(
    (
      tokenAddr: CW20Addr,
      terraswapPoolInfo: TerraswapPoolInfo<Token>,
      poolInfo: staking.PoolInfoResponse,
    ) => {
      return nebPool && distributionSchedule
        ? computeAPR(
            nebPool,
            distributionSchedule,
            tokenAddr,
            terraswapPoolInfo,
            poolInfo,
          )
        : ('0' as Rate);
    },
    [nebPool, distributionSchedule],
  );
}
