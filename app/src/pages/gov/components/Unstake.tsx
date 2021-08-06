import { fixHMR } from 'fix-hmr';
import styled from 'styled-components';
import React from 'react';

export interface GovUnstakeProps {
  className?: string;
}

function GovUnstakeBase({ className }: GovUnstakeProps) {
  return <div className={className}>GovUnstake</div>;
}

export const StyledGovUnstake = styled(GovUnstakeBase)`
  // TODO
`;

export const GovUnstake = fixHMR(StyledGovUnstake);
