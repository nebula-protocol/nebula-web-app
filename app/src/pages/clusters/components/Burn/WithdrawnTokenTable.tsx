import { cw20, Token, u } from '@nebula-js/types';
import { TokenSpan } from '@nebula-js/ui';
import { fixHMR } from 'fix-hmr';
import styled from 'styled-components';
import React from 'react';
import { formatUToken } from '@nebula-js/notation';

export interface WithdrawnTokenTableProps {
  className?: string;
  redeemTokenAmounts: u<Token>[];
  assetTokenInfos: cw20.TokenInfoResponse<Token>[];
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
          <tr key={assetTokenInfos[i].symbol}>
            <td>
              <TokenSpan>{assetTokenInfos[i].symbol}</TokenSpan>
            </td>
            <td>
              <s>100 {assetTokenInfos[i].symbol}</s>
            </td>
            <td>
              {formatUToken(amount)} {assetTokenInfos[i].symbol}
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
