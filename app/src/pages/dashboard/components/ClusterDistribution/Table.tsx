import { formatRate, formatUToken } from '@nebula-js/notation';
import React from 'react';
import styled from 'styled-components';
import { Item } from './types';

export interface TableProps {
  className?: string;
  data: Item[];
}

function TableBase({ className, data }: TableProps) {
  return (
    <table className={className} cellPadding="0" cellSpacing="0">
      <tbody>
        {data.map(({ label, amount, ratio, color }) => (
          <tr key={label}>
            <th style={{ color }}>{label}</th>
            <td>{formatUToken(amount)} UST</td>
            <td>{formatRate(ratio)}%</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export const Table = styled(TableBase)`
  table-layout: auto;
  width: 100%;

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
      text-align: right;
      padding-left: 2em;
    }

    > :nth-child(3) {
      font-size: 0.9em;
      text-align: right;
      padding-left: 2em;
    }
  }
`;
