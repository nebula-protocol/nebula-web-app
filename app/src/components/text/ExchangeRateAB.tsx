import { SwapHoriz } from '@material-ui/icons';
import { EmptyButton } from '@nebula-js/ui';
import big, { BigSource } from 'big.js';
import { fixHMR } from 'fix-hmr';
import styled from 'styled-components';
import React, { useMemo, useState } from 'react';

export interface ExchangeRateABProps {
  className?: string;
  symbolA: string;
  symbolB: string;
  exchangeRateAB: BigSource;
  formatExchangeRate: (n: BigSource, direction: 'a/b' | 'b/a') => string;
  initialDirection?: 'a/b' | 'b/a';
}

function ExchangeRateABBase({
  className,
  exchangeRateAB,
  formatExchangeRate,
  initialDirection = 'b/a',
  symbolA,
  symbolB,
}: ExchangeRateABProps) {
  const [direction, setDirection] = useState<'a/b' | 'b/a'>(initialDirection);

  const exchangeRate = useMemo(() => {
    return direction === 'a/b'
      ? formatExchangeRate(exchangeRateAB, direction)
      : formatExchangeRate(big(1).div(exchangeRateAB), direction);
  }, [direction, exchangeRateAB, formatExchangeRate]);

  return (
    <span className={className}>
      {exchangeRate} {direction === 'a/b' ? symbolA : symbolB} per{' '}
      {direction === 'a/b' ? symbolB : symbolA}
      <EmptyButton
        onClick={() => setDirection((prev) => (prev === 'a/b' ? 'b/a' : 'a/b'))}
      >
        <SwapHoriz />
      </EmptyButton>
    </span>
  );
}

export const StyledExchangeRateAB = styled(ExchangeRateABBase)`
  svg {
    font-size: 1em;
    margin-left: 0.3em;
    transform: scale(1.2) translateY(0.05em);
  }
`;

export const ExchangeRateAB = fixHMR(StyledExchangeRateAB);
