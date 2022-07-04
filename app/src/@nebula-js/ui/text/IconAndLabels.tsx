import { fixedSizeStyle } from '../internal/fixedSizeStyle';
import React, { DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';
import styled from 'styled-components';
import { DelistedBadge } from './DelistedBadge';
import { TokenIcon } from '@nebula-js/ui';

export interface IconAndLabelsProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  className?: string;
  symbol?: string;
  text: ReactNode;
  subtext: ReactNode;
  isActive?: boolean;
  iconSize?: `${number}em`;
  textSize?: `${number}em`;
  subtextSize?: `${number}em`;
  iconMarginRight?: `${number}em`;
  textGap?: `${number}em`;
}

const _iconSize = '2em';
const _textSize = '1em';
const _subtextSize = '0.8em';
const _iconMarginRight = '0.9em';
const _textGap = '0.28571429em';

function IconAndLabelsBase({
  symbol,
  text,
  subtext,
  isActive = true,
  iconSize = _iconSize,
  textSize = _textSize,
  subtextSize = _subtextSize,
  iconMarginRight = _iconMarginRight,
  textGap = _textGap,
  ...divProps
}: IconAndLabelsProps) {
  return (
    <div {...divProps}>
      <TokenIcon symbol={symbol} />
      <div>
        <div>
          {!isActive && <DelistedBadge />}
          <span className="text">{text}</span>
        </div>
        <span className="subtext">{subtext}</span>
      </div>
    </div>
  );
}

export const IconAndLabels = styled(IconAndLabelsBase)`
  font-size: 1em;

  display: flex;
  align-items: center;

  > img {
    display: inline-block;
    ${({ iconSize = _iconSize }) => fixedSizeStyle(iconSize)};
    margin-right: ${({ iconMarginRight = _iconMarginRight }) =>
      iconMarginRight};
  }

  .text {
    display: block;
    font-size: ${({ textSize = _textSize }) => textSize};
    font-weight: 500;
    color: var(--color-white2);
  }

  .subtext {
    display: block;
    font-size: max(${({ subtextSize = _subtextSize }) => subtextSize}, 12px);
    font-weight: 500;
    color: var(--color-white6);
  }

  > div {
    > div {
      display: flex;
      align-items: center;
      margin-bottom: ${({ textGap = _textGap }) => textGap};
    }
  }
`;
