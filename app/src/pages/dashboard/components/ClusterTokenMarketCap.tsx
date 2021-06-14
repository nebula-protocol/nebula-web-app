import styled from 'styled-components';
import React from 'react';

export interface ClusterTokenMarketCapProps {
  className?: string;
}

function ClusterTokenMarketCapBase({ className }: ClusterTokenMarketCapProps) {
  return (
    <div className={className}>
      <p>
        400.7M <span>UST</span>
      </p>
    </div>
  );
}

export const ClusterTokenMarketCap = styled(ClusterTokenMarketCapBase)`
  p {
    font-size: 2.2em;

    span {
      font-size: 12px;
    }
  }
`;
