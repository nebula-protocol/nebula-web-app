import { fixHMR } from 'fix-hmr';
import * as React from 'react';
import { ComponentPropsWithRef, createElement } from 'react';
import styled from 'styled-components';

export type EmptyLinkProps<C extends React.ElementType> = {
  className?: string;
  component?: C;
  size?: number | { width: number; height: number };
  fontSize?: number | `${number}em`;
} & ComponentPropsWithRef<C>;

function EmptyLinkBase<C extends React.ElementType>({
  component = 'a',
  size,
  fontSize,
  ...props
}: EmptyLinkProps<C>) {
  return createElement(component, props);
}

export const StyledEmptyLink = styled(EmptyLinkBase)`
  text-decoration: none;

  color: inherit;

  font-size: ${({ fontSize }) =>
    typeof fontSize === 'number' ? `${fontSize}px` : fontSize};

  line-height: 1em;
  max-height: 1em;

  display: inline-flex;
  align-items: center;

  svg,
  img {
    font-size: 1em;
    width: 1em;

    transition: color 0.4s ease-out;
  }
`;

export const EmptyLink = fixHMR(StyledEmptyLink);
