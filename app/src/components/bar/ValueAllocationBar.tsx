import React from 'react';
import styled from 'styled-components';
import { TokenIcon } from '@nebula-js/ui';
import { AssetView } from 'pages/clusters/models/types';
import { formatRate } from '@libs/formatter';
import { Rate } from '@nebula-js/types';

interface ValueAllocationBarProps {
  className?: string;
  assets?: AssetView[];
  count: number;
}

function ValueAllocationBarBase({
  className,
  assets,
  count,
}: ValueAllocationBarProps) {
  const mockData = [
    {
      symbol: 'LUNA',
      ratio: 0.5424,
    },
    {
      symbol: 'UST',
      ratio: 0.2424,
    },
    {
      symbol: 'aUST',
      ratio: 0.1424,
    },
    {
      symbol: 'ANC',
      ratio: 0.1424,
    },
    {
      symbol: 'MIR',
      ratio: 0.0424,
    },
  ];

  return (
    <div className={className}>
      {mockData.map(({ symbol, ratio }) => (
        <div key={symbol} data-length={mockData.length}>
          <TokenIcon symbol={symbol} size={20} />
          <div>
            <p>{symbol}</p>
            <p>{formatRate(ratio as Rate<number>)}%</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export const ValueAllocationBar = styled(ValueAllocationBarBase)`
  display: flex;

  > div {
    display: flex;
    align-items: center;
    background-color: rgba(70, 63, 81, 0.5);
    padding: 4px 12px;
    width: fit-content;
    gap: 8px;
    margin: 0 2px;

    &:first-child {
      margin-left: 0;
      border-radius: 20px 0 0 20px;
    }

    &:last-child {
      margin-right: 0;
      border-radius: 0 20px 20px 0;
    }

    &[data-length='1'] {
      border-radius: 20px;
    }

    p:first-child {
      font-size: 10px;
      font-weight: 400;
      line-height: 1.5;
      letter-spacing: -0.3px;
      color: var(--color-white4);
    }

    p:last-child {
      font-size: 12px;
      font-weight: 500;
      line-height: 1.5;
      letter-spacing: -0.3px;
      color: var(--color-white3);
    }
  }
`;
