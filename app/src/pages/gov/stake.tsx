import styled from 'styled-components';
import React from 'react';

export interface GovStakeProps {
  className?: string;
}

function GovStakeBase({ className }: GovStakeProps) {
  return <div className={className}>GovStake</div>;
}

export const StyledGovStake = styled(GovStakeBase)`
  // TODO
`;

export default process.env.NODE_ENV === 'production'
  ? StyledGovStake
  : (props: GovStakeProps) => <StyledGovStake {...props} />;
