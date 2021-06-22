import { fixHMR } from 'fix-hmr';
import styled from 'styled-components';
import React from 'react';

export interface SendMainProps {
  className?: string;
}

function SendMainBase({ className }: SendMainProps) {
  return <div className={className}>SendMain</div>;
}

const StyledSendMain = styled(SendMainBase)`
  // TODO
`;

export default fixHMR(StyledSendMain);
