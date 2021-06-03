import React, {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  ReactNode,
} from 'react';
import styled from 'styled-components';

export interface TransparentButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  className?: string;
  size?: string | number;
  children: ReactNode;
}

function TransparentButtonBase({
  children,
  ...buttonProps
}: TransparentButtonProps) {
  return <button {...buttonProps}>{children}</button>;
}

export const TransparentButton = styled(TransparentButtonBase)`
  outline: none;
  border: 0;
  background-color: transparent;
  cursor: pointer;

  ${({ size }) => (typeof size === 'number' ? `font-size: ${size}px` : '')};

  width: ${({ size = 'auto' }) =>
    typeof size === 'number' ? size + 'px' : size};

  height: ${({ size = 'auto' }) =>
    typeof size === 'number' ? size + 'px' : size};

  display: grid;
  place-content: center;

  color: #23bed9;

  svg,
  img {
    font-size: 1em;
    width: 1em;
  }
`;
