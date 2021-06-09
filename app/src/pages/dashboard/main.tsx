import styled from 'styled-components';
import React from 'react';

export interface DashboardMainProps {
  className?: string;
}

function DashboardMainBase({ className }: DashboardMainProps) {
  return <div className={className}>DashboardMain</div>;
}

export default styled(DashboardMainBase)`
  // TODO
`;
