import { fixHMR } from 'fix-hmr';
import React, { DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';
import styled from 'styled-components';
import { Sub } from './Sub';

export interface PartitionLabel {
  label: ReactNode;
  value?: ReactNode;
  color: string;
}

export interface PartitionLabelsProps
  extends Omit<
    DetailedHTMLProps<HTMLAttributes<HTMLUListElement>, HTMLUListElement>,
    'ref'
  > {
  data: PartitionLabel[];
  children?: ReactNode;
  columnGap?: `${number}em`;
  rowGap?: `${number}em`;
}

const defaultColumnGap = '1.5em';
const defaultRowGap = '0.5em';

function PartitionLabelsBase({
  data,
  children,
  columnGap = defaultColumnGap,
  rowGap = defaultRowGap,
  ...ulProps
}: PartitionLabelsProps) {
  return (
    <ul {...ulProps}>
      {data.map(({ label, value, color }, i) => (
        <li key={'label' + i} style={{ color }}>
          <span>{label}</span>
          {value && <Sub>{value}</Sub>}
        </li>
      ))}
      {children}
    </ul>
  );
}

export const StyledPartitionLabels = styled(PartitionLabelsBase)`
  padding: 0;
  list-style: none;

  display: flex;
  column-gap: ${({ columnGap = defaultColumnGap }) => columnGap};
  row-gap: ${({ rowGap = defaultRowGap }) => rowGap};
  max-width: 100%;
  flex-wrap: wrap;

  span:first-child {
    font-weight: 500;
    margin-right: 0.4em;
  }
`;

export const PartitionLabels = fixHMR(StyledPartitionLabels);
