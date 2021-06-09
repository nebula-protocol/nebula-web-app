import styled from 'styled-components';
import React from 'react';

export interface PollCreateProps {
  className?: string;
}

function PollCreateBase({ className }: PollCreateProps) {
  return <div className={className}>PollCreate</div>;
}

export default styled(PollCreateBase)`
  // TODO
`;
