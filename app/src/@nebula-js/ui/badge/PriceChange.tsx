import { ArrowDropUp, ArrowDropDown } from '@material-ui/icons';
import React, { DetailedHTMLProps, HTMLAttributes, useMemo } from 'react';
import styled from 'styled-components';
import big from 'big.js';
import { formatRate } from '@libs/formatter';
import { Rate } from '@nebula-js/types';

export interface PriceChangeProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement> {
  diff: Rate;
  isOval?: boolean;
}

function PriceChangeBase({ className, diff, isOval = true }: PriceChangeProps) {
  const updown = useMemo(() => {
    const _diff = big(diff);
    return _diff.gt(0) ? 'up' : _diff.lt(0) ? 'down' : 'flat';
  }, [diff]);

  const diffIcon = useMemo(() => {
    return updown === 'up' ? (
      <ArrowDropUp />
    ) : updown === 'down' ? (
      <ArrowDropDown />
    ) : undefined;
  }, [updown]);

  const style = useMemo(() => {
    const color =
      updown === 'up'
        ? {
            color: 'var(--color-positive)',
          }
        : updown === 'down'
        ? {
            color: 'var(--color-error)',
          }
        : { color: 'var(--color-white4' };

    const background =
      updown === 'up'
        ? { backgroundColor: 'rgba(67, 224, 190, 0.2)' }
        : updown === 'down'
        ? { backgroundColor: 'rgba(254, 94, 83, 0.2)' }
        : { backgroundColor: 'var(--color-gray4)' };

    return isOval
      ? { ...color, ...background, padding: '0 8px' }
      : { ...color };
  }, [updown, isOval]);

  return (
    <span className={className} style={{ ...style }}>
      {isOval && diffIcon} {formatRate(diff)}%
    </span>
  );
}

export const PriceChange = styled(PriceChangeBase)`
  font-size: 12px;
  font-weight: 700;
  line-height: 18px;
  display: flex;
  align-items: center;
  border-radius: 20px;
  width: fit-content;
`;
