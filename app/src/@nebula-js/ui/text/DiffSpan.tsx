import { TrendingDown, TrendingFlat, TrendingUp } from '@material-ui/icons';
import React, { DetailedHTMLProps, HTMLAttributes } from 'react';
import styled from 'styled-components';

export interface DiffSpanProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement> {
  diff: number;
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
  return (
    <span {...spanProps}>
      {diff > 0 ? (
        <TrendingUp />
      ) : diff < 0 ? (
        <TrendingDown />
      ) : (
        <TrendingFlat />
      )}{' '}
      {children}
    </span>
  );
}

export const DiffSpan = styled(DiffSpanBase)`
  svg {
    font-size: 1em;

    ${({ translateIconY }) =>
      translateIconY ? `transform: translateY(${translateIconY})` : ''};
  }
`;
