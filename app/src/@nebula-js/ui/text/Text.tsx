import React, { DetailedHTMLProps, HTMLAttributes } from 'react';
import styled from 'styled-components';
import { Typography, TypographyTypeMap } from '@material-ui/core';

export interface TextProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  className?: string;
  variant?: TypographyTypeMap['props']['variant'] | 'label';
  color?: string;
  weight?: number | string;
}

function TextBase({ className, children, variant = 'body1' }: TextProps) {
  if (variant === 'label') {
    return (
      <Typography className={className} style={{ fontSize: '12px' }}>
        {children}
      </Typography>
    );
  } else {
    return (
      <Typography className={className} variant={variant}>
        {children}
      </Typography>
    );
  }
}

export const Text = styled(TextBase)`
  color: var(--color-${({ color }) => color});
  font-weight: ${({ weight }) => weight};
`;
