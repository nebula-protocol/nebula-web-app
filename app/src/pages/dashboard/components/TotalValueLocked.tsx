import { divWithDefault } from '@libs/big-math';
import { formatRate, formatUTokenWithPostfixUnits } from '@libs/formatter';
import { AnimateNumber } from '@libs/ui';
import { computeStakedValue, computeTotalProvided } from '@nebula-js/app-fns';
import {
  useClustersInfoListQuery,
  useTotalNebStaked,
  // useNebBalance,
  // useNebulaApp,
  useNebPrice,
  useStakingPoolInfoListQuery,
} from '@nebula-js/app-provider';
import { u, Luna, Rate } from '@nebula-js/types';
import {
  PartitionBarGraph,
  partitionColor,
  Sub,
  VerticalPartitionLabels,
} from '@nebula-js/ui';
import big, { Big } from 'big.js';
import React, { useMemo } from 'react';
import styled from 'styled-components';
import useResizeObserver from 'use-resize-observer/polyfilled';

export interface TotalValueLockedProps {
  className?: string;
}

function TotalValueLockedBase({ className }: TotalValueLockedProps) {
  // const { contractAddress } = useNebulaApp();

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const nebPrice = useNebPrice();
  const { data: clusterInfos = [] } = useClustersInfoListQuery();
  const { data: poolInfoList = [] } = useStakingPoolInfoListQuery();

  const { totalStaked: totalNebStaked } = useTotalNebStaked();

  // const communityNebBalance = useNebBalance(contractAddress.community);

  // ---------------------------------------------
  // computes
  // ---------------------------------------------
  const {
    tvl,
    totalProvidedRatio,
    totalLPStakedRatio,
    totalNebStakedRatio,
    // communityNebRatio,
  } = useMemo(() => {
    const totalProvided = computeTotalProvided(clusterInfos);

    const totalLPStakedValue = poolInfoList.reduce<u<Luna<Big>>>(
      (acc, { terraswapPoolInfo, poolInfo }) =>
        acc.plus(computeStakedValue(terraswapPoolInfo, poolInfo)) as u<
          Luna<Big>
        >,
      big('0') as u<Luna<Big>>,
    );

    const totalNebStakedValue = totalNebStaked.mul(nebPrice);

    // const communityNebValue = big(communityNebBalance).mul(nebPrice);

    const _tvl = totalProvided
      .plus(totalLPStakedValue)
      .plus(totalNebStakedValue) as u<Luna<Big>>;
    // .plus(communityNebValue) as u<Luna<Big>>;

    return {
      tvl: _tvl,
      totalProvidedRatio: divWithDefault(totalProvided, _tvl, 0) as Rate<Big>,
      totalLPStakedRatio: divWithDefault(
        totalLPStakedValue,
        _tvl,
        0,
      ) as Rate<Big>,
      totalNebStakedRatio: divWithDefault(
        totalNebStakedValue,
        _tvl,
        0,
      ) as Rate<Big>,
      // communityNebRatio: divWithDefault(
      //   communityNebValue,
      //   _tvl,
      //   0,
      // ) as Rate<Big>,
    };
  }, [
    totalNebStaked,
    // communityNebBalance,
    clusterInfos,
    poolInfoList,
    nebPrice,
  ]);

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  const { width = 300, ref } = useResizeObserver();

  return (
    <div className={className} ref={ref}>
      <section className="amount">
        <p>
          <AnimateNumber format={formatUTokenWithPostfixUnits}>
            {tvl}
          </AnimateNumber>{' '}
          <Sub>Luna</Sub>
        </p>
      </section>

      <section className="graph">
        <VerticalPartitionLabels
          data={[
            {
              label: 'INVENTORY',
              value: `${formatRate(totalProvidedRatio)}%`,
              color: partitionColor[0],
            },
            {
              label: 'LP STAKED',
              value: `${formatRate(totalLPStakedRatio)}%`,
              color: partitionColor[1],
            },
            {
              label: 'NEB STAKED',
              value: `${formatRate(totalNebStakedRatio)}%`,
              color: partitionColor[2],
            },
            // {
            //   label: 'COMMUNITY',
            //   value: `${formatRate(communityNebRatio)}%`,
            //   color: partitionColor[3],
            // },
          ]}
        />
        <PartitionBarGraph
          data={[
            {
              value: Number(totalProvidedRatio.mul(100).toFixed(2)),
              color: partitionColor[0],
            },
            {
              value: Number(totalLPStakedRatio.mul(100).toFixed(2)),
              color: partitionColor[1],
            },
            {
              value: Number(totalNebStakedRatio.mul(100).toFixed(2)),
              color: partitionColor[2],
            },
            // {
            //   value: Number(communityNebRatio.mul(100).toFixed(2)),
            //   color: partitionColor[3],
            // },
          ]}
          width={width}
          height={5}
        />
      </section>
    </div>
  );
}

export const TotalValueLocked = styled(TotalValueLockedBase)`
  .amount {
    p {
      font-size: var(--font-size32);
    }
  }

  > .graph {
    margin-top: 3em;
  }
`;
