import styled from 'styled-components';
import React from 'react';

export interface StakingMainProps {
  className?: string;
}

function StakingMainBase({ className }: StakingMainProps) {
  return <div className={className}>StakingMain</div>;
}

export default styled(StakingMainBase)`
  // TODO
`;
