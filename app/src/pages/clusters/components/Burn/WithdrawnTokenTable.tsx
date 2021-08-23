import { formatUToken } from '@libs/formatter';
import { Token, u } from '@nebula-js/types';
import { TokenSpan } from '@nebula-js/ui';
import { AssetTokenInfo } from '@nebula-js/webapp-fns';
import { fixHMR } from 'fix-hmr';
import React from 'react';
import styled from 'styled-components';

export interface WithdrawnTokenTableProps {
  className?: string;
  redeemTokenAmounts: u<Token>[];
  assetTokenInfos: AssetTokenInfo[];
}

function WithdrawnTokenTableBase({
  className,
  redeemTokenAmounts,
  assetTokenInfos,
}: WithdrawnTokenTableProps) {
  return (
    <table className={className}>
      <thead>
        <tr>
          <th>Withdrawn Token</th>
          <th>Amount per CT</th>
          <th>Returned Amount</th>
        </tr>
      </thead>
      <tbody>
        {redeemTokenAmounts.map((amount, i) => (
          <tr key={assetTokenInfos[i].tokenInfo.symbol}>
            <td>
              <TokenSpan>{assetTokenInfos[i].tokenInfo.symbol}</TokenSpan>
            </td>
            <td>
              <s>100 {assetTokenInfos[i].tokenInfo.symbol}</s>
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

export const StyledWithdrawnTokenTable = styled(WithdrawnTokenTableBase)`
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

export const WithdrawnTokenTable = fixHMR(StyledWithdrawnTokenTable);
