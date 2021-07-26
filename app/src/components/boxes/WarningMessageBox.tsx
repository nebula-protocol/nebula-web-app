import { fixHMR } from 'fix-hmr';
import styled from 'styled-components';
import React, { DetailedHTMLProps, HTMLAttributes } from 'react';
import { ErrorOutlineRounded } from '@material-ui/icons';

export interface WarningMessageBoxProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
  level: 'warning' | 'critical';
}

function WarningMessageBoxBase({
  level,
  children,
  ...sectionProps
}: WarningMessageBoxProps) {
  return (
    <section {...sectionProps}>
      <ErrorOutlineRounded />
      <p>{children}</p>
    </section>
  );
}

export const StyledWarningMessageBox = styled(WarningMessageBoxBase)`
  display: flex;
  align-items: center;
  gap: 0.5em;

  background-color: ${({ level }) =>
    level === 'critical' ? 'var(--color-red)' : 'var(--color-red)'};
  color: var(--color-white100);
  padding: 1.4em 1.7em;
  border-radius: 8px;
  font-weight: 400;
`;

export const WarningMessageBox = fixHMR(StyledWarningMessageBox);
