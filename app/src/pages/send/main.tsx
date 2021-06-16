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

export default process.env.NODE_ENV === 'production'
  ? StyledSendMain
  : (props: SendMainProps) => <StyledSendMain {...props} />;
