import { Rate, u, UST } from '@nebula-js/types';
import React, { useCallback, useEffect, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { PieChart } from './PieChart';
import { Table } from './Table';
import { Item } from './types';

export interface ClusterDistributionProps {
  className?: string;
}

const colors = ['#E0687F', '#A87D99', '#6F9EBB', '#5BBAD6'];

function ClusterDistributionBase({ className }: ClusterDistributionProps) {
  const theme = useTheme();

  const createRandomData = useCallback((): Item[] => {
    return Array.from(
      { length: Math.floor(Math.random() * 3) + 3 },
      (_, i) => ({
        label: `Title Item ${i}`,
        labelShort: `ITEM ${i}`,
        amount: (
          (Math.floor(Math.random() * 500) + 300) *
          100000
        ).toString() as u<UST>,
        ratio: '0.301' as Rate,
        color: colors[i % colors.length],
      }),
    );
  }, []);

  const [data, setData] = useState(() => createRandomData());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setData(createRandomData());
    }, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, [createRandomData]);

  return (
    <div className={className}>
      <PieChart data={data} theme={theme} />
      <Table data={data} />
    </div>
  );
}

export const ClusterDistribution = styled(ClusterDistributionBase)`
  canvas {
    max-height: 270px;
  }
`;
