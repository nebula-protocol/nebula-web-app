import styled from 'styled-components';
import React from 'react';

export interface PollCreateProps {
  className?: string;
}

function PollCreateBase({ className }: PollCreateProps) {
  return <div className={className}>PollCreate</div>;
}

export const StyledPollCreate = styled(PollCreateBase)`
  // TODO
`;

export default process.env.NODE_ENV === 'production'
  ? StyledPollCreate
  : (props: PollCreateProps) => <StyledPollCreate {...props} />;
