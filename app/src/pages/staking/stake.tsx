import styled from 'styled-components';
import React from 'react';

export interface StakingStakeProps {
  className?: string;
}

function StakingStakeBase({ className }: StakingStakeProps) {
  return <div className={className}>StakingStake</div>;
}

export default styled(StakingStakeBase)`
  // TODO
`;
