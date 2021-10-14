import { useTerraTokenDisplayInfo } from '@libs/app-provider';
import { terraswap } from '@libs/types';
import { fixHMR } from 'fix-hmr';
import React from 'react';
import styled from 'styled-components';

export interface TokenLabelProps {
  className?: string;
  assetInfo: terraswap.AssetInfo;
}

function TokenLabelBase({ className, assetInfo }: TokenLabelProps) {
  const { tokenInfo, tokenDisplayInfo } = useTerraTokenDisplayInfo(assetInfo);

  return (
    <div className={className}>
      <div>
        {tokenDisplayInfo?.icon && (
          <img
            className="icon"
            src={tokenDisplayInfo?.icon}
            alt={tokenDisplayInfo.symbol}
          />
        )}
      </div>
      <div>
        <p>{tokenInfo?.symbol}</p>
        {tokenInfo?.symbol !== tokenInfo?.name ? (
          <p>{tokenInfo?.name}</p>
        ) : null}
      </div>
    </div>
  );
}

export const StyledTokenLabel = styled(TokenLabelBase)`
  height: 40px;

  display: flex;
  align-items: center;

  > :first-child {
    width: 40px;

    margin-right: 8px;

    display: grid;
    place-content: center;

    img {
      max-width: 30px;
    }
  }

  > :last-child {
    flex: 1;

    > :nth-child(2) {
      font-size: 12px;
      white-space: nowrap;
    }
  }
`;

export const TokenLabel = fixHMR(StyledTokenLabel);
