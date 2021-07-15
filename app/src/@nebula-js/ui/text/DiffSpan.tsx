import { TrendingDown, TrendingFlat, TrendingUp } from '@material-ui/icons';
import big, { BigSource } from 'big.js';
import React, { DetailedHTMLProps, HTMLAttributes, useMemo } from 'react';
import styled from 'styled-components';

export interface DiffSpanProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement> {
  diff: BigSource;
  translateIconY?: string | number;
  riseColor?: string;
  sameColor?: string;
  downColor?: string;
}

function DiffSpanBase({
  diff,
  translateIconY,
  riseColor,
  downColor,
  children,
  ...spanProps
}: DiffSpanProps) {
  const diffIcon = useMemo(() => {
    const _diff = big(diff);
    return _diff.gt(0) ? (
      <TrendingUp />
    ) : _diff.lt(0) ? (
      <TrendingDown />
    ) : (
      <TrendingFlat />
    );
  }, [diff]);

  return (
    <span {...spanProps}>
      {diffIcon} {children}
    </span>
  );
}

export const DiffSpan = styled(DiffSpanBase)`
  svg {
    font-size: 1em;

    ${({ translateIconY }) =>
      translateIconY
        ? `transform: translateY(${
            typeof translateIconY === 'number'
              ? translateIconY + 'px'
              : translateIconY
          })`
        : ''};
  }
`;
