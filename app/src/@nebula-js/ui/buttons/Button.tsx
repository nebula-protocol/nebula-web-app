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
  componentProps?: Record<string, any>;
}

function ButtonBase({
  size = 'normal',
  color,
  fullWidth,
  componentProps,
  ...buttonProps
}: ButtonProps) {
  return (
    <MuiButtonBase {...buttonProps} {...componentProps} data-size={size} />
  );
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
      color: var(--color-paleblue-text);
      background-color: var(--color-paleblue);

      &:hover {
        background-color: hsl(
          var(--color-paleblue-h),
          var(--color-paleblue-s),
          calc(var(--color-paleblue-l) + 15%)
        );
      }

      &:disabled {
        color: var(--color-white44);
        background-color: var(--color-gray22);
      }
    `;
  } else if (color === 'gray') {
    return css`
      color: var(--color-white80);
      background-color: var(--color-gray24);

      &:hover {
        background-color: var(--color-gray34);
      }

      &:disabled {
        color: var(--color-white44);
        background-color: var(--color-gray22);
      }
    `;
  } else if (color === 'dark') {
    return css`
      color: var(--color-paleblue);
      background-color: var(--color-gray11);

      &:hover {
        color: hsl(
          var(--color-paleblue-h),
          var(--color-paleblue-s),
          calc(var(--color-paleblue-l) + 15%)
        );
        background-color: var(--color-gray08);
      }

      &:disabled {
        color: var(--color-gray34);
      }
    `;
  } else if (color === 'dim') {
    return css`
      color: var(--color-white44);
      background-color: var(--color-gray22);

      &:hover {
        color: var(--color-white64);
      }

      &:disabled {
        color: var(--color-gray34);
      }
    `;
  } else if (color === 'border') {
    return css`
      color: var(--color-white44);
      background-color: transparent;
      border: 1px solid var(--color-gray22);

      &:hover {
        color: var(--color-paleblue);
        border-color: var(--color-paleblue);
      }

      &:disabled {
        color: var(--color-gray34);
        border-color: var(--color-gray34);
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
        color: var(--color-white44);
        background-color: var(--color-gray22);
      }
    `;
};

export const Button = styled(ButtonBase)`
  ${({ size = 'normal' }) => buttonSizeStyle[size]};
  ${({ color = 'paleblue' }) => buttonColorStyle(color)};

  ${({ fullWidth = false }) => (fullWidth ? 'width: 100%' : '')};
`;
