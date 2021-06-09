import styled from 'styled-components';
import React from 'react';

export interface PollDetailProps {
  className?: string;
}

function PollDetailBase({ className }: PollDetailProps) {
  return <div className={className}>PollDetail</div>;
}

export default styled(PollDetailBase)`
  // TODO
`;
