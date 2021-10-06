import { fixHMR } from 'fix-hmr';
import styled from 'styled-components';
import React, { ReactNode } from 'react';

export interface VerticalLabelAndValueProps {
  className?: string;
  label: ReactNode;
  children: ReactNode;
}

function VerticalLabelAndValueBase({
  className,
  label,
  children,
}: VerticalLabelAndValueProps) {
  return (
    <div className={className}>
      <h4>{label}</h4>
      <p>{children}</p>
    </div>
  );
}

export const StyledVerticalLabelAndValue = styled(VerticalLabelAndValueBase)`
  font-size: var(--font-size14-12);

  h4 {
    font-size: var(--font-size12);
    font-weight: 500;
    color: var(--color-white44);
    margin-bottom: 0.28571429em;
  }
`;

export const VerticalLabelAndValue = fixHMR(StyledVerticalLabelAndValue);
