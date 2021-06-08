import type { PaletteColor } from '@material-ui/core/styles/createPalette';
import styled, { css } from 'styled-components';
import React from 'react';
import {
  ButtonBase as MuiButtonBase,
  ButtonBaseProps as MuiButtonBaseProps,
} from '@material-ui/core';

export interface ButtonProps extends Omit<MuiButtonBaseProps, 'ref' | 'color'> {
  size?: 'normal' | 'medium' | 'small' | 'tiny';
  color?: 'paleblue' | 'gray' | 'dark' | 'dim' | PaletteColor;
  fullWidth?: boolean;
}

function ButtonBase({ size, color, fullWidth, ...buttonProps }: ButtonProps) {
  return <MuiButtonBase {...buttonProps} />;
}

export const buttonSizeStyle = {
  normal: css`
    height: 64px;
    font-size: 18px;
    border-radius: 8px;

    svg {
      font-size: 1em;
    }
  `,
  medium: css`
    height: 42px;
    font-size: 14px;
    border-radius: 8px;

    svg {
      font-size: 1em;
    }
  `,
  small: css`
    height: 32px;
    font-size: 12px;
    border-radius: 8px;

    svg {
      font-size: 1em;
    }
  `,
  tiny: css`
    height: 20px;
    font-size: 10px;
    border-radius: 10px;
    padding: 1px 10px 0 10px;

    svg {
      font-size: 1em;
    }
  `,
};

export const buttonColorStyle = (color: ButtonProps['color']) => {
  if (!color || color === 'paleblue') {
    return css`
      color: ${({ theme }) => theme.colors.paleblue.contrastText};
      background-color: ${({ theme }) => theme.colors.paleblue.main};

      &:hover {
        background-color: ${({ theme }) => theme.colors.paleblue.light};
      }

      &:disabled {
        color: ${({ theme }) => theme.colors.white44};
        background-color: ${({ theme }) => theme.colors.gray22};
      }
    `;
  } else if (color === 'gray') {
    return css`
      color: ${({ theme }) => theme.colors.white80};
      background-color: ${({ theme }) => theme.colors.gray24};

      &:hover {
        background-color: ${({ theme }) => theme.colors.gray34};
      }

      &:disabled {
        color: ${({ theme }) => theme.colors.white44};
        background-color: ${({ theme }) => theme.colors.gray22};
      }
    `;
  } else if (color === 'dark') {
    return css`
      color: ${({ theme }) => theme.colors.paleblue.main};
      background-color: ${({ theme }) => theme.colors.gray11};

      &:hover {
        color: ${({ theme }) => theme.colors.paleblue.light};
        background-color: ${({ theme }) => theme.colors.gray08};
      }

      &:disabled {
        color: ${({ theme }) => theme.colors.gray34};
      }
    `;
  } else if (color === 'dim') {
    return css`
      color: ${({ theme }) => theme.colors.white44};
      background-color: ${({ theme }) => theme.colors.gray22};

      &:hover {
        color: ${({ theme }) => theme.colors.white64};
      }

      &:disabled {
        color: ${({ theme }) => theme.colors.gray34};
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
        color: ${({ theme }) => theme.colors.white44};
        background-color: ${({ theme }) => theme.colors.gray22};
      }
    `;
};

export const Button = styled(ButtonBase)`
  ${({ size = 'normal' }) => buttonSizeStyle[size]};
  ${({ color = 'paleblue' }) => buttonColorStyle(color)};

  ${({ fullWidth = false }) => (fullWidth ? 'width: 100%' : '')};
`;
