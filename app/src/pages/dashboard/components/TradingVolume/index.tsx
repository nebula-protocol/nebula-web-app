import { JSDateTime, u, UST } from '@nebula-js/types';
import { DiffSpan, Sub } from '@nebula-js/ui';
import React from 'react';
import { useStyle } from '@packages/style-router';
import styled from 'styled-components';
import { BarChart } from './BarChart';

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

export interface TradingVolumeProps {
  className?: string;
}

function TradingVolumeBase({ className }: TradingVolumeProps) {
  const { color } = useStyle();

  return (
    <div className={className}>
      <p>
        <s>
          51M <Sub>UST</Sub>
        </s>
      </p>
      <p>
        <DiffSpan diff={-123.12} translateIconY="0.15em">
          <s>123.12%</s>
        </DiffSpan>
      </p>

      <BarChart data={chartData} color={color} />
    </div>
  );
}

export const TradingVolume = styled(TradingVolumeBase)`
  > :nth-child(1) {
    font-size: var(--font-size32);
  }

  > :nth-child(2) {
    font-size: var(--font-size12);

    margin-bottom: 1rem;
  }
`;
