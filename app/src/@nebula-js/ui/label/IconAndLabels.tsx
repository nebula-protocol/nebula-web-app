import styled from 'styled-components';
import React, { DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';

export interface IconAndLabelsProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  className?: string;
  icon?: ReactNode;
  text: ReactNode;
  subtext: ReactNode;
  iconSize?: `${number}em`;
  textSize?: `${number}em`;
  subtextSize?: `${number}em`;
}

const _iconSize = '2em';
const _textSize = '1em';
const _subtextSize = '0.8em';

function IconAndLabelsBase({
  icon,
  text,
  subtext,
  iconSize = _iconSize,
  textSize = _textSize,
  subtextSize = _subtextSize,
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
    width: ${({ iconSize = _iconSize }) => iconSize};
    height: ${({ iconSize = _iconSize }) => iconSize};
    background-color: ${({ theme, icon }) =>
      !icon ? theme.colors.gray34 : 'transparent'};
    border-radius: 50%;

    margin-right: 0.9em;
  }

  > div {
    > :first-child {
      display: block;
      font-size: ${({ textSize = _textSize }) => textSize};
      font-weight: 500;
      color: ${({ theme }) => theme.colors.white92};
      margin-bottom: 0.1em;
    }

    > :last-child {
      display: block;
      font-size: ${({ subtextSize = _subtextSize }) => subtextSize};
      font-weight: 500;
      color: ${({ theme }) => theme.colors.white44};
    }
  }
`;
