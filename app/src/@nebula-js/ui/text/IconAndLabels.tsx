import { fixedSizeStyle } from '../internal/fixedSizeStyle';
import React, { DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';
import styled from 'styled-components';

export interface IconAndLabelsProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  className?: string;
  icon?: ReactNode;
  text: ReactNode;
  subtext: ReactNode;
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
  icon,
  text,
  subtext,
  iconSize = _iconSize,
  textSize = _textSize,
  subtextSize = _subtextSize,
  iconMarginRight = _iconMarginRight,
  textGap = _textGap,
  ...divProps
}: IconAndLabelsProps) {
  return (
    <div {...divProps}>
      <i>{icon}</i>
      <div>
        <span>{text}</span>
        <span>{subtext}</span>
      </div>
    </div>
  );
}

export const IconAndLabels = styled(IconAndLabelsBase)`
  font-size: 1em;

  display: flex;
  align-items: center;

  > i {
    display: inline-block;
    ${({ iconSize = _iconSize }) => fixedSizeStyle(iconSize)};
    background-color: ${({ icon }) =>
      !icon ? 'var(--color-gray34)' : 'transparent'};
    border-radius: 50%;

    margin-right: ${({ iconMarginRight = _iconMarginRight }) =>
      iconMarginRight};
  }

  > div {
    > :first-child {
      display: block;
      font-size: ${({ textSize = _textSize }) => textSize};
      font-weight: 500;
      color: var(--color-white92);
      margin-bottom: ${({ textGap = _textGap }) => textGap};
    }

    > :last-child {
      display: block;
      font-size: max(${({ subtextSize = _subtextSize }) => subtextSize}, 12px);
      font-weight: 500;
      color: var(--color-white44);
    }
  }
`;
