import styled from 'styled-components';
import React from 'react';

export interface ClusterSellProps {
  className?: string;
}

function ClusterSellBase({ className }: ClusterSellProps) {
  return <div className={className}>ClusterSell</div>;
}

export const ClusterSell = styled(ClusterSellBase)`
  // TODO
`;
