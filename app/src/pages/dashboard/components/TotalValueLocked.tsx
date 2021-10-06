import { sum } from '@libs/big-math';
import { formatUTokenIntegerWithPostfixUnits } from '@libs/formatter';
import { AnimateNumber } from '@libs/ui';
import { computeMarketCap } from '@nebula-js/app-fns';
import { useClustersInfoListQuery } from '@nebula-js/app-provider';
import { u, UST } from '@nebula-js/types';
import { PartitionBarGraph, Sub, VerticalPartitionLabels } from '@nebula-js/ui';
import big, { Big } from 'big.js';
import React, { useMemo } from 'react';
import styled from 'styled-components';
import useResizeObserver from 'use-resize-observer/polyfilled';

export interface TotalValueLockedProps {
  className?: string;
}

function TotalValueLockedBase({ className }: TotalValueLockedProps) {
  const { data: clusterInfos = [] } = useClustersInfoListQuery();

  const marketCapTotal = useMemo(() => {
    if (clusterInfos.length === 0) {
      return big(0) as u<UST<Big>>;
    }

    const marketCaps = clusterInfos.map(({ clusterState, terraswapPool }) => {
      return computeMarketCap(clusterState, terraswapPool);
    });

    return sum(...marketCaps) as u<UST<Big>>;
  }, [clusterInfos]);

  const { width = 300, ref } = useResizeObserver();

  return (
    <div className={className} ref={ref}>
      <section className="amount">
        <p>
          <AnimateNumber format={formatUTokenIntegerWithPostfixUnits}>
            {marketCapTotal}
          </AnimateNumber>{' '}
          <Sub>UST</Sub>
        </p>
      </section>

      <section className="graph">
        <VerticalPartitionLabels
          data={[
            {
              label: 'INVENTORY',
              value: <s>24.4%</s>,
              color: '#cccccc',
            },
            {
              label: 'LP STAKED',
              value: <s>20.8%</s>,
              color: '#cccccc',
            },
            {
              label: 'NEB STAKED',
              value: <s>16.2%</s>,
              color: '#cccccc',
            },
            {
              label: 'COMMUNITY',
              value: <s>16.2%</s>,
              color: '#cccccc',
            },
          ]}
        />
        <PartitionBarGraph
          data={[
            {
              value: 24.4,
              color: '#cccccc',
            },
            {
              value: 24.4,
              color: '#cccccc',
            },
            {
              value: 24.4,
              color: '#cccccc',
            },
            {
              value: 24.4,
              color: '#cccccc',
            },
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
