import React, { useMemo } from 'react';
import styled from 'styled-components';
import { imageURL } from '../env';

export interface TokenIconProps {
  className?: string;
  symbol?: string;
  size?: number;
}

function TokenIconBase({ className, symbol = '' }: TokenIconProps) {
  const placeholder = useMemo(() => {
    const fontColor = 'eeedee';
    const background = '685f75';

    return `https://ui-avatars.com/api/?rounded=true&size=128&name=${symbol}&color=${fontColor}&background=${background}&length=4&?format=svg&font-size=0.3`;
  }, [symbol]);

  return (
    <img
      className={className}
      src={imageURL(symbol) ?? placeholder}
      alt={symbol ?? 'icon'}
    />
  );
}

export const TokenIcon = styled(TokenIconBase)`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
`;
