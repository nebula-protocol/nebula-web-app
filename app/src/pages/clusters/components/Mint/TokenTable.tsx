import { formatUToken } from '@libs/formatter';
import { Token, u } from '@nebula-js/types';
import { TokenSpan } from '@nebula-js/ui';
import { AssetTokenInfo } from '@nebula-js/app-fns';
import { fixHMR } from 'fix-hmr';
import React from 'react';
import styled from 'styled-components';

export interface TokenTableProps {
  className?: string;
  name: string;
  amounts: u<Token>[];
  assetTokenInfos: AssetTokenInfo[];
}

function TokenTableBase({
  className,
  name,
  amounts,
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
              <TokenSpan>{assetTokenInfos[i].tokenInfo.symbol}</TokenSpan>
            </td>
            <td>
              {formatUToken(amount)} {assetTokenInfos[i].tokenInfo.symbol}
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
    color: var(--color-white44);

    th {
      border-bottom: 1px solid var(--color-gray24);
      padding-bottom: 1em;
    }
  }

  tbody {
    font-size: 1em;
    color: var(--color-white80);

    td {
      border-bottom: 1px solid var(--color-gray24);
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
`;

export const TokenTable = fixHMR(StyledTokenTable);
