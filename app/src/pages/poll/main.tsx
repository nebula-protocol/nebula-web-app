import styled from 'styled-components';
import React from 'react';

export interface PollMainProps {
  className?: string;
}

function PollMainBase({ className }: PollMainProps) {
  return <div className={className}>PollMain</div>;
}

export default styled(PollMainBase)`
  // TODO
`;
