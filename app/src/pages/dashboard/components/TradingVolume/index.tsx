import { JSDateTime, uUST } from '@nebula-js/types';
import { DiffSpan, Sub } from '@nebula-js/ui';
import React from 'react';
import styled, { useTheme } from 'styled-components';
import { BarChart } from './BarChart';

const chartData = Array.from(
  { length: Math.floor(Math.random() * 30) + 30 },
  (_, i) => {
    return {
      y: 10 * i + 10 - Math.random() * 20,
      amount: i.toString() as uUST,
      date: Date.now() as JSDateTime,
    };
  },
);

export interface TradingVolumeProps {
  className?: string;
}

function TradingVolumeBase({ className }: TradingVolumeProps) {
  const theme = useTheme();

  return (
    <div className={className}>
      <p>
        51M <Sub>UST</Sub>
      </p>
      <p>
        <DiffSpan diff={-123.12} translateIconY="0.15em">
          123.12%
        </DiffSpan>
      </p>

      <BarChart data={chartData} theme={theme} />
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
