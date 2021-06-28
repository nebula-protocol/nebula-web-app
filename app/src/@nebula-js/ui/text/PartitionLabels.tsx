import { Sub } from './Sub';
import { fixHMR } from 'fix-hmr';
import styled from 'styled-components';
import React, { DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';

export interface PartitionLabel {
  label: ReactNode;
  value: ReactNode;
  color: string;
}

export interface PartitionLabelsProps
  extends Omit<
    DetailedHTMLProps<HTMLAttributes<HTMLUListElement>, HTMLUListElement>,
    'ref'
  > {
  className?: string;
  data: PartitionLabel[];
  children?: ReactNode;
}

function PartitionLabelsBase({
  className,
  data,
  children,
}: PartitionLabelsProps) {
  return (
    <ul className={className}>
      {data.map(({ label, value, color }, i) => (
        <li key={'label' + i} style={{ color }}>
          <span>{label}</span>
          <Sub>{value}</Sub>
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
  column-gap: 1.5em;
  row-gap: 0.5em;
  max-width: 100%;
  flex-wrap: wrap;

  span:first-child {
    font-weight: 500;
    margin-right: 0.4em;
  }
`;

export const PartitionLabels = fixHMR(StyledPartitionLabels);
