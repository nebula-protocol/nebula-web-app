import React, { DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';
import styled from 'styled-components';
import { TokenIcon } from '../icons';
import { fixedSizeStyle } from '../internal/fixedSizeStyle';

export interface TokenSpanProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement> {
  symbol?: string;
  icon?: ReactNode;
}

function TokenSpanBase({
  symbol,
  icon,
  children,
  ...spanProps
}: TokenSpanProps) {
  return (
    <span {...spanProps}>
      {icon ? icon : <TokenIcon symbol={symbol} />}
      <span>{children}</span>
    </span>
  );
}

export const TokenSpan = styled(TokenSpanBase)`
  display: inline-flex;
  align-items: center;

  font-size: 1em;

  > img {
    margin-right: 0.5em;
    ${fixedSizeStyle('1.4em')};
  }

  > div {
    margin-right: 0.5em;
  }
`;
