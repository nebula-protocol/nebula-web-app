import styled from 'styled-components';
import React from 'react';

export interface StakingUnstakeProps {
  className?: string;
}

function StakingUnstakeBase({ className }: StakingUnstakeProps) {
  return <div className={className}>StakingUnstake</div>;
}

export const StakingUnstake = styled(StakingUnstakeBase)`
  // TODO
`;
