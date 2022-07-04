import { PaletteColor } from '@material-ui/core/styles/createPalette';
import { fixHMR } from 'fix-hmr';
import React from 'react';
import styled, { css } from 'styled-components';
import { EmptyButton, EmptyButtonProps } from './EmptyButton';

export interface TextButtonProps
  extends Omit<EmptyButtonProps, 'ref' | 'color'> {
  color?: 'paleblue' | PaletteColor;
}

function TextButtonBase({ color, size, ...emptyButtonProps }: TextButtonProps) {
  return <EmptyButton {...emptyButtonProps} />;
}

export const textButtonColorStyle = (color: TextButtonProps['color']) => {
  if (!color || color === 'paleblue') {
    return css`
      color: var(--color-paleblue);

      &:hover {
        color: hsl(
          var(--color-paleblue-h),
          var(--color-paleblue-s),
          calc(var(--color-paleblue-l) + 15%)
        );
      }

      &:disabled {
        color: var(--color-gray5);
      }
    `;
  } else if (color)
    return css`
      color: ${color.contrastText};
      background-color: ${color.main};

      &:hover {
        background-color: ${color.light};
      }

      &:disabled {
        color: var(--color-white6);
        background-color: var(--color-gray5);
      }
    `;
};

export const StyledTextButton = styled(TextButtonBase)`
  ${({ color = 'paleblue' }) => textButtonColorStyle(color)};
`;

export const TextButton = fixHMR(StyledTextButton);
