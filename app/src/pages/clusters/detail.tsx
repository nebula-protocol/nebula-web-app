import styled from 'styled-components';
import React from 'react';

export interface ClustersDetailProps {
  className?: string;
}

function ClustersDetailBase({ className }: ClustersDetailProps) {
  return <div className={className}>ClustersDetail</div>;
}

export default styled(ClustersDetailBase)`
  // TODO
`;
