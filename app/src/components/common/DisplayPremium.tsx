import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';
import { Rate } from '@nebula-js/types';
import { Big } from 'big.js';
import { formatRate } from '@libs/formatter';

interface Props extends HTMLAttributes<HTMLParagraphElement> {
  premium: Rate<Big>;
  isColored?: boolean;
  showSign?: boolean;
}

const DisplayPremium = ({
  premium,
  isColored = true,
  showSign = true,
  ...props
}: Props) => {
  return (
    <DisplayPremiumBase premium={premium} isColored={isColored} {...props}>
      {showSign && premium.gt(0) ? '+' : ''}
      {formatRate(premium)}%
    </DisplayPremiumBase>
  );
};

const DisplayPremiumBase = styled.span<{
  premium: Rate<Big>;
  isColored: boolean;
}>`
  font-weight: inherit;
  font-size: inherit;
  color: var(
    ${({ premium, isColored }) =>
      !isColored || premium.eq(0)
        ? '--color-white2'
        : premium.gt(0)
        ? '--color-blue'
        : '--color-red'}
  );
`;

export { DisplayPremium };
