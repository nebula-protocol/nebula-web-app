import { formatUToken } from '@libs/formatter';
import { Token, u, UST } from '@nebula-js/types';
import { TokenSpan } from '@nebula-js/ui';
import { AssetTokenInfo } from '@nebula-js/app-fns';
import { fixHMR } from 'fix-hmr';
import big, { Big } from 'big.js';
import React from 'react';
import styled from 'styled-components';

export interface TokenTableProps {
  className?: string;
  name: string;
  amounts: u<Token>[];
  prices: UST[];
  assetTokenInfos: AssetTokenInfo[];
}

function TokenTableBase({
  className,
  name,
  amounts,
  prices,
  assetTokenInfos,
}: TokenTableProps) {
  return (
    <table className={className}>
      <thead>
        <tr>
          <th>Token</th>
          <th>{name}</th>
        </tr>
      </thead>
      <tbody>
        {amounts.map((amount, i) => (
          <tr key={assetTokenInfos[i].tokenInfo.symbol}>
            <td>
              <TokenSpan symbol={assetTokenInfos[i].tokenInfo.symbol}>
                {assetTokenInfos[i].tokenInfo.symbol}
              </TokenSpan>
            </td>
            <td className="two-line">
              <p>
                {formatUToken(amount)} {assetTokenInfos[i].tokenInfo.symbol}
              </p>
              <p>
                {formatUToken(big(amount).mul(prices[i]) as u<Token<Big>>)} UST
              </p>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export const StyledTokenTable = styled(TokenTableBase)`
  table-layout: auto;
  width: 100%;

  thead {
    font-size: 12px;
    font-weight: 500;
    color: var(--color-white6);

    th {
      border-bottom: 1px solid var(--color-gray6);
      padding-bottom: 1em;
    }
  }

  tbody {
    font-size: 1em;
    color: var(--color-white3);

    td {
      border-bottom: 1px solid var(--color-gray6);
      padding: 1em 0;
    }
  }

  th,
  td {
    &:first-child {
      text-align: left;
    }

    &:not(:first-child) {
      text-align: right;
    }
  }

  .two-line {
    > p:not(:first-child) {
      font-size: var(--font-size12);
      color: var(--color-white5);
    }
  }
`;

export const TokenTable = fixHMR(StyledTokenTable);
