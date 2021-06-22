import { Sub } from '@nebula-js/ui';
import styled from 'styled-components';
import React from 'react';

export interface ClusterTokenMarketCapProps {
  className?: string;
}

function ClusterTokenMarketCapBase({ className }: ClusterTokenMarketCapProps) {
  return (
    <div className={className}>
      <p>
        400.7M <Sub>UST</Sub>
      </p>
    </div>
  );
}

export const ClusterTokenMarketCap = styled(ClusterTokenMarketCapBase)`
  p {
    font-size: var(--font-size32);
  }
`;
