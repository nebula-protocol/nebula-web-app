import styled from 'styled-components';
import React from 'react';

export interface SendMainProps {
  className?: string;
}

function SendMainBase({ className }: SendMainProps) {
  return <div className={className}>SendMain</div>;
}

export default styled(SendMainBase)`
  // TODO
`;
