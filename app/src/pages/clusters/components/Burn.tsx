import styled from 'styled-components';
import React from 'react';

export interface ClusterBurnProps {
  className?: string;
}

function ClusterBurnBase({ className }: ClusterBurnProps) {
  return <div className={className}>ClusterBurn</div>;
}

export const ClusterBurn = styled(ClusterBurnBase)`
  // TODO
`;
