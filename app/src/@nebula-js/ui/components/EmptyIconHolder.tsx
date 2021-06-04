import React, { DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';
import styled from 'styled-components';
import { specificSizeStyle } from './internal/internalSpecificSizeStyle';

export interface EmptyIconHolderProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
  className?: string;
  children: ReactNode;
  size?: number | { width: number; height: number };
  fontSize?: number;
}

function EmptyIconHolderBase({ size, ...iProps }: EmptyIconHolderProps) {
  return <i {...iProps} />;
}

export const EmptyIconHolder = styled(EmptyIconHolderBase)`
  ${({ size }) => (!!size ? specificSizeStyle(size) : '')};

  color: inherit;

  font-size: ${({ fontSize }) =>
    typeof fontSize === 'number' ? `${fontSize}px` : 'inherit'};

  line-height: 1em;
  max-height: 1em;

  > * {
    font-size: 1em;
    width: 1em;
  }
`;
