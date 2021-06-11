import styled from 'styled-components';
import React from 'react';

export interface ClusterMintProps {
  className?: string;
}

function ClusterMintBase({ className }: ClusterMintProps) {
  return <div className={className}>ClusterMint</div>;
}

export const ClusterMint = styled(ClusterMintBase)`
  // TODO
`;
