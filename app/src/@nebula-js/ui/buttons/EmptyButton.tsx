import React, {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  ReactNode,
} from 'react';
import styled from 'styled-components';
import { specificSizeStyle } from '../internal/internalSpecificSizeStyle';

export interface EmptyButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  className?: string;
  children: ReactNode;
  size?: number | { width: number; height: number };
  fontSize?: number;
}

function EmptyButtonBase({
  size,
  className,
  ...buttonProps
}: EmptyButtonProps) {
  return (
    <button className={className + ' Nebula-EmptyButton'} {...buttonProps} />
  );
}

export const EmptyButton = styled(EmptyButtonBase)`
  outline: none;
  border: 0;
  background-color: transparent;
  cursor: pointer;

  ${({ size }) => (!!size ? specificSizeStyle(size) : '')};

  color: inherit;

  font-size: ${({ fontSize }) =>
    typeof fontSize === 'number' ? `${fontSize}px` : 'inherit'};

  line-height: 1em;
  max-height: 1em;

  svg,
  img {
    font-size: 1em;
    width: 1em;

    transition: color 0.4s ease-out;
  }
`;
