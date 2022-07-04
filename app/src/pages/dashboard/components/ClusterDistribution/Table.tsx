import { formatRate, formatUTokenWithPostfixUnits } from '@libs/formatter';
import { AnimateNumber } from '@libs/ui';
import React from 'react';
import styled from 'styled-components';
import { Item } from './types';
import { fixHMR } from 'fix-hmr';

export interface TableProps {
  className?: string;
  data: Item[];
}

function TableBase({ className, data }: TableProps) {
  return (
    <table className={className} cellPadding="0" cellSpacing="0">
      <thead>
        <tr>
          <th>
            <span>Cluster</span>
          </th>
          <th>
            <span>Provided Asset</span>
          </th>
          <th>
            <span>Ratio</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map(({ id, name, provided, ratio, color }) => (
          <tr key={id}>
            <th style={{ color }}>{name}</th>
            <td>
              <AnimateNumber format={formatUTokenWithPostfixUnits}>
                {provided}
              </AnimateNumber>{' '}
              UST
            </td>
            <td>
              <AnimateNumber format={formatRate}>{ratio}</AnimateNumber>%
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const StyledTable = styled(TableBase)`
  table-layout: auto;
  width: 100%;

  font-size: var(--font-size14-12);

  tr {
    th,
    td {
      padding: 0.8em 0;
    }

    &:not(:last-child) {
      th,
      td {
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      }
    }

    > :nth-child(1) {
      text-align: left;
    }

    > :nth-child(2) {
      word-break: keep-all;
      white-space: nowrap;
      text-align: right;
      padding-left: 2em;
    }

    > :nth-child(3) {
      word-break: keep-all;
      white-space: nowrap;
      font-size: var(--font-size12);
      text-align: right;
      padding-left: 2em;
    }
  }

  thead {
    tr {
      th {
        color: var(--color-white6);
        font-weight: 500;
        border-bottom: 1px solid var(--color-gray6);
      }
    }
  }
`;

export const Table = fixHMR(StyledTable);
