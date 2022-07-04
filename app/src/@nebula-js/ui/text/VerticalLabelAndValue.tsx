import { fixHMR } from 'fix-hmr';
import styled from 'styled-components';
import React, { ReactNode } from 'react';
import { InfoTooltip } from '../tooltip';

export interface VerticalLabelAndValueProps {
  className?: string;
  label: ReactNode;
  tip?: string;
  children: ReactNode;
}

function VerticalLabelAndValueBase({
  className,
  label,
  tip,
  children,
}: VerticalLabelAndValueProps) {
  return (
    <div className={className}>
      <p className="label">
        {label} {tip && <InfoTooltip>{tip}</InfoTooltip>}
      </p>
      {children}
    </div>
  );
}

export const StyledVerticalLabelAndValue = styled(VerticalLabelAndValueBase)`
  p.label {
    font-size: var(--font-size12);
    font-weight: 700;
    color: var(--color-white4);
    margin-bottom: 0.28571429em;
  }
`;

export const VerticalLabelAndValue = fixHMR(StyledVerticalLabelAndValue);
