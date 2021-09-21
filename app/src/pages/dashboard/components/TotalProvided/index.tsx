import { sum } from '@libs/big-math';
import { formatUTokenWithPostfixUnits } from '@libs/formatter';
import { useStyle } from '@libs/style-router';
import { AnimateNumber } from '@libs/ui';
import { JSDateTime, u, UST } from '@nebula-js/types';
import { DiffSpan, Sub } from '@nebula-js/ui';
import { computeProvided } from '@nebula-js/app-fns';
import { useClustersInfoListQuery } from '@nebula-js/app-provider';
import big, { Big } from 'big.js';
import React, { useMemo } from 'react';
import styled from 'styled-components';
import { AreaChart } from './AreaChart';

const chartData = Array.from(
  { length: Math.floor(Math.random() * 30) + 30 },
  (_, i) => {
    return {
      y: 10 * i + 10 - Math.random() * 20,
      amount: i.toString() as u<UST>,
      date: Date.now() as JSDateTime,
    };
  },
);

export interface TotalProvidedProps {
  className?: string;
}

function TotalProvidedBase({ className }: TotalProvidedProps) {
  const { color } = useStyle();

  const { data: clusterInfos = [] } = useClustersInfoListQuery();

  const totalProvided = useMemo(() => {
    if (clusterInfos.length === 0) {
      return big(0) as u<UST<Big>>;
    }

    const provided = clusterInfos.map(({ clusterState }) => {
      return computeProvided(clusterState);
    });

    return sum(...provided) as u<UST<Big>>;
  }, [clusterInfos]);

  return (
    <div className={className}>
      <p>
        <AnimateNumber format={formatUTokenWithPostfixUnits}>
          {totalProvided}
        </AnimateNumber>{' '}
        <Sub>UST</Sub>
      </p>
      <p>
        <s>
          <DiffSpan diff={123.12} translateIconY="0.15em">
            123.12%
          </DiffSpan>
        </s>
      </p>

      <AreaChart data={chartData} color={color} />
    </div>
  );
}

export const TotalProvided = styled(TotalProvidedBase)`
  > :nth-child(1) {
    font-size: var(--font-size32);
  }

  > :nth-child(2) {
    font-size: var(--font-size12);

    margin-bottom: 1rem;
  }
`;
