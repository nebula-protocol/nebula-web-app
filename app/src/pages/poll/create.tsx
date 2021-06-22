import { fixHMR } from 'fix-hmr';
import React from 'react';
import styled from 'styled-components';

export interface PollCreateProps {
  className?: string;
}

function PollCreateBase({ className }: PollCreateProps) {
  return <div className={className}>PollCreate</div>;
}

export const StyledPollCreate = styled(PollCreateBase)`
  // TODO
`;

export default fixHMR(StyledPollCreate);
