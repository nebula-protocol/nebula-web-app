import styled from 'styled-components';
import React from 'react';

export interface ClustersMainProps {
  className?: string;
}

function ClustersMainBase({ className }: ClustersMainProps) {
  return <div className={className}>ClustersMain</div>;
}

export default styled(ClustersMainBase)`
  // TODO
`;
