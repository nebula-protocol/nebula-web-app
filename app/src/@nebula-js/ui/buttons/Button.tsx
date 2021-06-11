import {
  ButtonBase as MuiButtonBase,
  ButtonBaseProps as MuiButtonBaseProps,
} from '@material-ui/core';
import type { PaletteColor } from '@material-ui/core/styles/createPalette';
import React from 'react';
import styled, { css } from 'styled-components';

export interface ButtonProps extends Omit<MuiButtonBaseProps, 'ref' | 'color'> {
  size?: 'normal' | 'medium' | 'small' | 'tiny';
  color?: 'paleblue' | 'gray' | 'dark' | 'dim' | 'border' | PaletteColor;
  fullWidth?: boolean;
}

function ButtonBase({
  size = 'normal',
  color,
  fullWidth,
  ...buttonProps
}: ButtonProps) {
  return <MuiButtonBase {...buttonProps} data-size={size} />;
}

const svgStyle = css`
  font-size: 1em;
`;

export const buttonSizeStyle = {
  normal: css`
    height: 4.5rem;
    font-size: 1.3rem;
    border-radius: 8px;
    padding: 0 20px;

    svg {
      ${svgStyle};
    }
  `,
  medium: css`
    height: 3.14rem;
    font-size: 1rem;
    border-radius: 8px;
    padding: 0 15px;

    svg {
      ${svgStyle};
    }
  `,
  small: css`
    height: 2.3rem;
    font-size: 1rem;
    border-radius: 8px;
    padding: 0 10px;

    svg {
      ${svgStyle};
    }
  `,
  tiny: css`
    height: 1.4rem;
    font-size: 0.7rem;
    border-radius: 10px;
    padding: 1px 10px 0 10px;

    svg {
      ${svgStyle};
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
  } else if (color === 'border') {
    return css`
      color: ${({ theme }) => theme.colors.white44};
      background-color: transparent;
      border: 1px solid ${({ theme }) => theme.colors.gray22};

      &:hover {
        color: ${({ theme }) => theme.colors.paleblue.main};
        border-color: ${({ theme }) => theme.colors.paleblue.main};
      }

      &:disabled {
        color: ${({ theme }) => theme.colors.gray34};
        border-color: ${({ theme }) => theme.colors.gray34};
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
