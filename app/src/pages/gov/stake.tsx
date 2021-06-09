import styled from 'styled-components';
import React from 'react';

export interface GovStakeProps {
  className?: string;
}

function GovStakeBase({ className }: GovStakeProps) {
  return <div className={className}>GovStake</div>;
}

export default styled(GovStakeBase)`
  // TODO
`;
