import { PaletteColor } from '@material-ui/core/styles/createPalette';
import { fixHMR } from 'fix-hmr';
import React, { ComponentPropsWithRef, createElement } from 'react';
import styled from 'styled-components';
import { EmptyLink } from './EmptyLink';
import { textButtonColorStyle } from './TextButton';

export type TextLinkProps<C extends React.ElementType> = {
  className?: string;
  component?: C;
  color?: 'paleblue' | PaletteColor;
} & ComponentPropsWithRef<C>;

function TextLinkBase<C extends React.ElementType>({
  color,
  ...props
}: TextLinkProps<C>) {
  return createElement(EmptyLink, props);
}

const StyledTextLink = styled(TextLinkBase)`
  ${({ color = 'paleblue' }) => textButtonColorStyle(color)};

  text-decoration: none;
`;

export const TextLink = fixHMR(StyledTextLink);
