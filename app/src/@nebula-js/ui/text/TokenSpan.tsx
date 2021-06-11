import React, { DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';
import styled from 'styled-components';

export interface TokenSpanProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement> {
  icon?: ReactNode;
}

function TokenSpanBase({ icon, children, ...spanProps }: TokenSpanProps) {
  return (
    <span {...spanProps}>
      <i>{icon}</i>
      <span>{children}</span>
    </span>
  );
}

export const TokenSpan = styled(TokenSpanBase)`
  display: inline-flex;
  align-items: center;

  font-size: 1em;

  > i {
    margin-right: 0.5em;
  }

  > i:empty {
    background-color: ${({ theme }) => theme.colors.gray34};
    border-radius: 50%;
    min-width: 1.4em;
    min-height: 1.4em;
    max-width: 1.4em;
    max-height: 1.4em;
  }
`;
