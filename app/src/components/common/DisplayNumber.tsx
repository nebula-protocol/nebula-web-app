import React, { HTMLAttributes } from 'react';
import styled, { css } from 'styled-components';
import { Sub } from '../../@nebula-js/ui';

const numberStyles = {
  md: css`
    font-size: 32px;
  `,
  sm: css`
    font-size: 20px;
  `,
};

type Size = 'md' | 'sm';

interface Props extends HTMLAttributes<HTMLParagraphElement> {
  price: string;
  currency: string;
  size?: Size;
}

const DisplayNumber = ({ price, currency, size = 'md', ...props }: Props) => {
  const [big, small] = price.split('.');
  return (
    <DisplayNumberBase size={size} {...props}>
      {big}
      {small ? (
        <Sub>
          .{small} {currency}
        </Sub>
      ) : (
        <Sub style={{ marginLeft: 4 }}>{currency}</Sub>
      )}
    </DisplayNumberBase>
  );
};

const DisplayNumberBase = styled.p<{ size: Size }>`
  color: var(--color-white2);
  font-weight: 500;
  ${({ size }) => numberStyles[size]}
`;

export { DisplayNumber };
