import { ClusterInfo } from '@nebula-js/webapp-fns';
import { fixHMR } from 'fix-hmr';
import styled from 'styled-components';
import React from 'react';

export interface BurnAdvancedProps {
  className?: string;
  clusterInfo: ClusterInfo;
}

function BurnAdvancedBase({ className }: BurnAdvancedProps) {
  return <div className={className}>BurnAdvanced</div>;
}

export const StyledBurnAdvanced = styled(BurnAdvancedBase)`
  // TODO
`;

export const BurnAdvanced = fixHMR(StyledBurnAdvanced);
