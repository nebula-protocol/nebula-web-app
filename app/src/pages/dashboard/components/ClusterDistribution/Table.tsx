import { formatRate, formatUTokenWithPostfixUnits } from '@nebula-js/notation';
import { AnimateNumber } from '@nebula-js/ui';
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
        {data.map(({ name, marketCap, ratio, color }) => (
          <tr key={name}>
            <th style={{ color }}>{name}</th>
            <td>
              <AnimateNumber format={formatUTokenWithPostfixUnits}>
                {marketCap}
              </AnimateNumber>{' '}
              UST
            </td>
            <td>
              <AnimateNumber format={formatRate}>{ratio}</AnimateNumber> %
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export const Table = styled(TableBase)`
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
      text-align: right;
      padding-left: 2em;
    }
    
    > :nth-child(3) {
      font-size: font-size: var(--font-size12);
      text-align: right;
      padding-left: 2em;
    }
  }
`;
